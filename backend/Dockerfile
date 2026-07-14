FROM python:3.11-slim 

#Install graphviz as graphviz binaries are important for better layout calculation
RUN apt-get update && apt-get install -y graphviz graphviz-dev && rm -rf /var/lib/apt/lists/*

#Set working directory
WORKDIR /app 

#Get the dependencies 
COPY backend/requirements.txt . 
RUN pip install --no-cache-dir -r requirements.txt 

#COPY the rest of the code
COPY . .   

#Expose the Port and Run APP 
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
