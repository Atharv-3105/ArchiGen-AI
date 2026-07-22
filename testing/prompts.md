### Basic & Standard Prompts (Smoke Tests)
- Use these to verify the happy path: Parser → Architecture → Layout → Style → Validator → Annotation.
- #### Prompt 1 (The Classic 3-Tier):
> "A simple 3-tier web application with a React frontend, a Node.js backend API, and a PostgreSQL database."
- What it tests: Basic node generation, standard layered layout (Frontend -> API -> Data), and basic styling.
- #### Prompt 2 (Mobile & BaaS):
> "A mobile application built with Flutter, using Firebase Authentication, Cloud Functions for the backend logic, and Cloud Firestore for the database."
- What it tests: Handling non-traditional tech stacks (BaaS) and ensuring the Architecture Agent correctly maps them to logical layers.
---

### Complex & Detailed Prompts (Stress Tests)
Use these to test the Layout Agent's spatial reasoning, the Style Agent's color mapping, and the Annotation Agent's ability to generate a deep ADR.
- #### Prompt 3 (Event-Driven Microservices):
> "An event-driven e-commerce architecture. It has a React web frontend and a Node.js API Gateway. The gateway routes requests to a Python Order Service and a Go Inventory Service. Both services communicate asynchronously via a RabbitMQ message broker. The Order Service writes to a PostgreSQL database, and the Inventory Service writes to a Redis cache."
- **What it tests**: Multiple nodes in the same layer (Service), complex edge routing, and the Annotation Agent's ability to write an ADR about asynchronous communication and caching.
- #### Prompt 4 (Serverless Data Pipeline):
> "A serverless data pipeline. A React dashboard triggers an AWS Lambda function via API Gateway. The Lambda writes raw JSON to an S3 bucket. An S3 event triggers an AWS Glue job to process the data and load it into Amazon Redshift. Finally, Amazon Athena queries Redshift to feed analytics back to the dashboard."
- **What it tests**: Heavy infrastructure components, non-linear data flows, and the Layout Agent's ability to handle complex topologies without overlapping nodes.

---
### Refinement Prompts (Iterative Editing)
- Use these to test the /refine endpoint and the Refinement Agent. Note: You must generate a base diagram first before using these.
1. Step 1 (Base Generation):
> "A basic user management system with a React frontend, a Python Flask API, and a MySQL database."
2. Step 2 (Add Component):
> "Add a Redis cache between the Flask API and the MySQL database to speed up read operations."
- What it tests: The Refinement Agent's ability to inject a new node into an existing graph and update the edges correctly.
3. Step 3 (Remove/Replace Component):
> "Replace the MySQL database with MongoDB, and remove the Redis cache entirely."
- What it tests: Surgical removal of nodes and edges without breaking the rest of the graph's structural integrity.
4. Step 4 (Add Cross-Cutting Concern):
> "Add a Load Balancer in front of the Python Flask API, and add a centralized Logging Service that collects logs from both the API and the Database."
- What it tests: Adding infrastructural nodes and creating "fan-out" edges (e.g., API -> Logger, DB -> Logger).

---

### Edge Cases & Ambiguity (Validator & Repair Loop Tests)
- Use these to intentionally trigger the Validator and Repair Agents to ensure your self-healing loop works.
- #### Prompt 5 (Highly Vague):
> "Build me a cloud app."
- What it tests: How the Parser handles extreme ambiguity. It should either trigger the Clarification Agent (if enabled) or generate a highly generic, minimal graph.
- #### Prompt 6 (Contradictory Instructions):
> "Create a system where the React frontend talks directly to the PostgreSQL database for security, but also route all traffic through a Node.js API Gateway."
- What it tests: How the Architecture Agent resolves logical conflicts. It should prioritize the API Gateway for security and drop the direct frontend-to-DB connection.
- #### Prompt 7 (Massive Context):
> (Copy and paste a 500-word technical specification document from a real GitHub README).
- What it tests: Context window limits, parsing speed, and whether the LLM gets "lost in the middle" of the document.
