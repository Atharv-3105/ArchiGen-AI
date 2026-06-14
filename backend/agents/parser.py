import os 
from dotenv import load_dotenv 
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from models import ParsedIntent
import time 
import logging 
load_dotenv()


logger = logging.getLogger(__name__) 

#Initialize the LLM
llm = ChatGroq(
    model = "llama-3.3-70b-versatile",
    temperature=0.1,
    max_tokens = 2048,
)

SYSTEM_PROMPT = """ 
You are an expert software architect and systems analyst. 
Your task is to analyze a user's plain English description of a software system and extract a structured architectural intent.

Rules:
1. Identify the high-level system type (microservices, monolith, event-driven, serverless).
2. Extract all distinct components (databases, services, frontends, queues, etc.).
3. Map the relationships and data flow between these components.
4. Identify any critical ambiguities. If the user's prompt is too vague to build a concrete diagram, formulate specific follow-up questions in the 'ambiguities' list.
5. Provide a confidence score between 0.0 and 1.0.

Output ONLY valid JSON matching the provided schema. Do not include markdown formatting like ```json.

"""

#Create the Prompt template
prompt = ChatPromptTemplate.from_messages([
    ("system", SYSTEM_PROMPT),
    ("human", "{user_input}")
])

#Bind the LLM output to a fix structured output
structured_llm = llm.with_structured_output(ParsedIntent)

chain = prompt | structured_llm

def parse_user_input(user_input: str) -> ParsedIntent:
    
    logger.info("Starting parser agent...")
    logger.debug(f"Raw user Input: {user_input}")
    
    start_time = time.time()
    
    try:
        result = chain.invoke({"user_input": user_input})
        duration = time.time() - start_time
        
        logger.info(f"Parser Agent completed successfully in {duration:.2f}s")
        logger.debug(f"Parsed Intent: {result.model_dump()}")
        return result
    except Exception as e:
        duration = time.time() - start_time
        print(f"Parser Agent Error: {e}")
        raise e