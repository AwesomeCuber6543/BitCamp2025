from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import dotenv
import os
from elevenlabs import ElevenLabs
import asyncio
import requests
import time
from google import genai
from google.genai import types
import chromadb
import json

chroma_client = chromadb.PersistentClient(path="./chroma_db")

chroma_collection = chroma_client.get_or_create_collection("embeddings_for_search")

dotenv.load_dotenv("project.env")

ELEVEN_LABS_KEY = "sk_491b13a2d71ee22d03470c63bf25b8ec98c6c3907a9e4cd4"
GEMINI_API_KEY = "AIzaSyBc1wdarNm6KdiEH1IQOLmbyewq1Hn-rHw"

# Check if API key is available
if not ELEVEN_LABS_KEY:
    raise ValueError("ELEVEN_LABS_KEY environment variable is not set or empty")

# Create a single client instance
eleven_labs_client = ElevenLabs(api_key=ELEVEN_LABS_KEY)
gemini_client = genai.Client(api_key=GEMINI_API_KEY)

app = FastAPI()


@app.post("/replace_first_message_and_system_prompt")
def replace_first_message_and_system_prompt(name_of_company: str):
    # return [
    #     f"Hello, I'm mandy from {name_of_company} how can I help you today?",
    #     f"You are a helpful assistant for {name_of_company}, You are given a index that you can RAG from to check different information and from there. You can answer general questions like 'what does {name_of_company} do?' without querying the index but if there is something that you need to know, you can query the index. If you cannot find the information you can say that. "
    # ]
    
    response = eleven_labs_client.conversational_ai.update_agent(
        agent_id="av48KozJHOIl1bWHmjuE",
        conversation_config = {
            "agent": {
                "first_message": f"Hello, I'm mandy from {name_of_company} how can I help you today?",
                "prompt": {
                    "prompt": f"You are a helpful customer service agent for {name_of_company}, You are given a index that you can RAG from to check different information and from there. You can answer general questions like 'what does {name_of_company} do?' without querying the index but if there is something that you need to know, you can query the index. If you cannot find the information you can say that. "
                }
            }
        }
    )


class SetUrlCompanyKnowledgeBase(BaseModel):
    url: str
    company_name: str
    


@app.post("/set_url_company_knowledge_base")
async def set_url_company_knowledge_base(url: SetUrlCompanyKnowledgeBase):
    # Use the global client instead of creating a new one
    response = eleven_labs_client.conversational_ai.create_knowledge_base_url_document(
        url=url.url,
        name=url.company_name,
    )
    
    print(response)
    knowledge_base_id = response.id
    
    response = eleven_labs_client.conversational_ai.update_agent(
        agent_id="av48KozJHOIl1bWHmjuE",
        conversation_config = {
            "agent": {
                "prompt": {
                    "knowledge_base": [
                        {
                        "type": "url",
                        "name": url.company_name,
                        "id": "nkFKBLAfUzBYBk7zdSMq",
                        "usage_mode": "auto"
                        },
                    ]
                }
            }
        }
    )
    
    print(response)
    return {"message": "URL set successfully"}

# {
#   "id": "ti16VNN5rKP90ZSuyg64",
#   "name": "McDonald's: Burgers, Fries & More. Quality Ingredients.",
#   "prompt_injectable": true
# }

@app.post("/get_agent_info")
async def get_agent_info():
    response = eleven_labs_client.conversational_ai.get_agent(
        agent_id="av48KozJHOIl1bWHmjuE"
    )
    
    return response

class SetAgentDynamicVariables(BaseModel):
    company_name: str
    company_url: str

@app.post("/set_agent_dynamic_variables")
async def set_agent_dynamic_variables(dynamic_variables: SetAgentDynamicVariables):
    try:
        # Use direct REST API calls instead of the SDK
        import requests
        
        current_agent = eleven_labs_client.conversational_ai.get_agent(
            agent_id="av48KozJHOIl1bWHmjuE"
        )
        
        # Extract the existing tools configuration
        print("Extracting existing tools...")
        existing_tools = current_agent.conversation_config.agent.prompt.tools
        
        # First update just the company name
        url = "https://api.elevenlabs.io/v1/convai/agents/av48KozJHOIl1bWHmjuE"
        headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "xi-api-key": ELEVEN_LABS_KEY
        }
        
        # Simple payload with just the company name update
        payload = {
            "conversation_config": {
                "agent": {
                    "dynamic_variables": {
                        "dynamic_variable_placeholders": {
                            "name_of_company": dynamic_variables.company_name
                        }
                    }
                }
            }
        }
        
        
        
        print("Updating company name...")
        response = requests.patch(url, json=payload, headers=headers)
        if response.status_code >= 400:
            print(f"Error updating company name: {response.text}")
            return {"error": response.text}
        
        api_schema = {
            "url": existing_tools[0].api_schema.url,
        }
        
        # return [
        #     existing_tools[0].api_schema,
        #     existing_tools[0].name,
        #     existing_tools[0].dynamic_variables.dynamic_variable_placeholders['url'],
        # ]
        # Now update the URL in the webhook
        url_payload = {
            "conversation_config": {
                "agent": {
                    "prompt": {
                        "tools": [
                            {  # The ID from your agent info
                                "type": "webhook",
                                "api_schema": api_schema,
                                "description": existing_tools[0].description,
                                "name": existing_tools[0].name,
                                "dynamic_variables": {
                                    "dynamic_variable_placeholders": {
                                        "url": dynamic_variables.company_url
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }
        


        
        print("Updating webhook URL...")
        url_response = requests.patch(url, json=url_payload, headers=headers)
        if url_response.status_code >= 400:
            print(f"Error updating URL: {url_response.text}")
            return {"error": url_response.text}
        
        return {"message": "Successfully updated dynamic variables", 
                "company_name": dynamic_variables.company_name,
                "company_url": dynamic_variables.company_url}
    except Exception as e:
        import traceback
        print(f"Error: {str(e)}")
        print(traceback.format_exc())
        return {"error": str(e), "traceback": traceback.format_exc()}

class PerplexityQuery(BaseModel):
    query: str
    url: str

@app.post("/create_embedding")
def create_embedding(query: str):


    result = gemini_client.models.embed_content(
            model="gemini-embedding-exp-03-07",
            contents=query,
            config=types.EmbedContentConfig(task_type="SEMANTIC_SIMILARITY")
    )
    print(result.embeddings)

@app.post("/search_perplexity")
def search_perplexity(query: PerplexityQuery):
    initial_time = time.time()
    url = "https://api.perplexity.ai/chat/completions"

    payload = {
        "model": "sonar",
        "messages": [
            {
                "role": "system",
                "content": "Be precise and concise."
            },
            {
                "role": "user",
                "content": f"{query.query}, Here is a url for the company if you might need it: {query.url}"
            }
        ],
        "max_tokens": 123,
        "temperature": 0.2,
        "top_p": 0.9,
        "return_images": False,
        "return_related_questions": False,
        "top_k": 0,
        "stream": False,
        "presence_penalty": 0,
        "frequency_penalty": 1,
        "response_format": {"type": "text"},
        "web_search_options": {"search_context_size": "high"}
    }
    headers = {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json"
    }

    response = requests.request("POST", url, json=payload, headers=headers)
    
    # Parse the JSON response
    response_data = response.json()
    
    # Extract just the content with the answer
    answer_content = response_data["choices"][0]["message"]["content"]
    
    # print("Answer:", answer_content)
    print("Time taken:", time.time() - initial_time)
    
    # Return just the answer content
    # return {"answer": answer_content, "time": time.time() - initial_time}
    return {"answer": answer_content}

@app.post("/update_webhook_url_constant")
async def update_webhook_url_constant(new_url: str):
    try:
        # Get the current agent configuration
        agent_info = eleven_labs_client.conversational_ai.get_agent(
            agent_id="av48KozJHOIl1bWHmjuE"
        )
        
        # Find the webhook tool
        webhook_tool = None
        for tool in agent_info.conversation_config.agent.prompt.tools:
            if tool.type == "webhook":
                webhook_tool = tool
                break
        
        if not webhook_tool:
            return {"error": "Webhook tool not found"}
        
        # Create a deep copy of the webhook tool configuration
        webhook_config = {
            "id": webhook_tool.id,
            "type": "webhook",
            "name": webhook_tool.name,
            "description": webhook_tool.description
        }
        
        # Extract and modify the API schema
        api_schema = {
            "url": webhook_tool.api_schema.url,
            "method": webhook_tool.api_schema.method,
            "path_params_schema": webhook_tool.api_schema.path_params_schema,
            "query_params_schema": webhook_tool.api_schema.query_params_schema,
            "request_headers": webhook_tool.api_schema.request_headers,
            # "request_body_schema": webhook_tool.api_schema.request_body_schema
        }
        
        # Extract and modify the request body schema
        request_body_schema = dict(webhook_tool.api_schema.request_body_schema)
        properties = dict(request_body_schema.get("properties", {}))
        
        # Update the URL constant value
        if "url" in properties:
            url_property = dict(properties["url"])
            url_property["constant_value"] = new_url
            properties["url"] = url_property
        
        request_body_schema["properties"] = properties
        api_schema["request_body_schema"] = request_body_schema
        
        # Use direct REST API calls for more control
        import requests
        
        url = "https://api.elevenlabs.io/v1/convai/agents/av48KozJHOIl1bWHmjuE"
        headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "xi-api-key": ELEVEN_LABS_KEY
        }
        
        # Create the payload with the updated webhook configuration
        # But preserve all other tools
        tools = []
        for tool in agent_info.conversation_config.agent.prompt.tools:
            if tool.type == "webhook":
                # Replace with our modified webhook tool
                tools.append({
                    "id": webhook_tool.id,
                    "type": "webhook",
                    "name": webhook_tool.name,
                    "description": webhook_tool.description,
                    "api_schema": api_schema
                })
            else:
                # Keep other tools (like end_call) as they are
                tools.append({
                    "id": tool.id,
                    "type": tool.type,
                    "name": tool.name,
                    "description": tool.description,
                    "params": tool.params if hasattr(tool, "params") else {}
                })
        
        payload = {
            "conversation_config": {
                "agent": {
                    "prompt": {
                        "tools": tools
                    }
                }
            }
        }
        
        print("Updating webhook URL constant value...")
        response = requests.patch(url, json=payload, headers=headers)
        
        if response.status_code >= 400:
            print(f"Error updating webhook: {response.text}")
            return {"error": response.text}
        
        return {
            "message": "Successfully updated webhook URL constant value",
            "new_url": new_url
        }
    except Exception as e:
        import traceback
        print(f"Error: {str(e)}")
        print(traceback.format_exc())
        return {"error": str(e), "traceback": traceback.format_exc()}

if __name__ == "__main__":
    # asyncio.run(set_url_company_knowledge_base(SetUrlCompanyKnowledgeBase(url="https://www.ikea.com/us/en/", company_name="Ikea")))
    # print(asyncio.run(get_agent_info()))
    # answer = search_perplexity(query="What time does the IKEA store on baltimore avenue in Maryland open and close?")
    # print("\nJust the answer:", answer)
    # create_embedding(query="What time does the IKEA store on baltimore avenue in Maryland open and close?")
    # print(asyncio.run(set_agent_dynamic_variables(SetAgentDynamicVariables(company_name="Peraton", company_url="https://www.peraton.com/"))))
    print(replace_first_message_and_system_prompt(name_of_company="McDonalds"))
    print(asyncio.run(update_webhook_url_constant(new_url="https://www.mcdonalds.com/")))