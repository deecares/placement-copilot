import random

HR_QUESTIONS = {
    "Easy": [
        "Tell me about yourself and your professional background.",
        "Why are you interested in this role and our company?"
    ],
    "Medium": [
        "Describe a situation where you had to work with tight deadlines. How did you manage?",
        "Tell me about a time you had to learn a new technology quickly for a project."
    ],
    "Hard": [
        "Tell me about a time you disagreed with a manager or team lead. How did you handle the situation?",
        "Describe a major failure in a previous project. What went wrong and what did you learn?"
    ]
}

ROLE_QUESTIONS = {
    "Backend Developer": {
        "Technical": {
            "Easy": [
                "Explain the difference between HTTP GET and POST requests.",
                "What is a database index and why is it used?",
                "What is the difference between SQL and NoSQL databases?"
            ],
            "Medium": [
                "Explain the difference between session authentication and token-based (JWT) authentication.",
                "What is database normalization and when should you denormalize data?",
                "Explain the difference between optimistic and pessimistic locking in database transaction isolation."
            ],
            "Hard": [
                "How would you optimize a database query that is experiencing locks under high traffic?",
                "Explain how you would handle distributed transactions across multiple microservices.",
                "Design a secure, low-latency API gateway strategy for a microservices architecture."
            ]
        },
        "Coding": {
            "Easy": [
                "Write a Python function to reverse a string.",
                "Write a SQL query to find duplicate emails in a User table."
            ],
            "Medium": [
                "Write a Python decorator to log endpoint response execution time.",
                "Implement an algorithm to detect a cycle in a directed graph."
            ],
            "Hard": [
                "Implement a thread-safe LRU Cache in Python.",
                "Write a function to merge K sorted lists in O(N log K) time."
            ]
        },
        "System Design": {
            "Easy": [
                "Explain horizontal vs vertical scaling.",
                "What is a CDN and when would you use it?"
            ],
            "Medium": [
                "Design a URL shortening service (like Bit.ly).",
                "Design a REST API database schema for an e-commerce shopping cart."
            ],
            "Hard": [
                "Design a distributed message queue system like Apache Kafka.",
                "Design a highly available and scalable notification service like Twilio."
            ]
        }
    },
    "Frontend Developer": {
        "Technical": {
            "Easy": [
                "What is the DOM?",
                "Explain the difference between local storage and session storage.",
                "What is the difference between state and props in React?"
            ],
            "Medium": [
                "Explain React hooks and what rules must be followed when using them.",
                "What is the Virtual DOM and how does React's reconciliation algorithm work?",
                "Explain CSS specificity and how CSS grid differs from Flexbox."
            ],
            "Hard": [
                "How would you optimize the initial load performance of a massive single-page application?",
                "Explain how hydration works in server-side rendered (SSR) React frameworks like Next.js.",
                "How do you implement micro-frontend architecture safely?"
            ]
        },
        "Coding": {
            "Easy": [
                "Write a Javascript function to filter out duplicate items in an array.",
                "Write a simple function to debounce another function call."
            ],
            "Medium": [
                "Implement a custom React hook `useLocalStorage` to persist state.",
                "Write a deep-clone function in JavaScript to copy nested objects."
            ],
            "Hard": [
                "Implement a custom virtualized list rendering engine in React for 100k items.",
                "Write a custom Promise class from scratch supporting `.then()` and `.catch()`."
            ]
        },
        "System Design": {
            "Easy": [
                "What is Single Page Application (SPA) vs Multi-Page Application (MPA)?",
                "Explain CSS-in-JS vs CSS modules."
            ],
            "Medium": [
                "Design a real-time collaborative code editor interface frontend layout.",
                "Design a global state management library structure similar to Redux or Zustand."
            ],
            "Hard": [
                "Design a dashboard application supporting real-time chart widgets and offline synchronizations.",
                "Design a frontend system architecture for a web application like Figma, focusing on asset loading and canvas performance."
            ]
        }
    },
    "Software Engineer": {
        "Technical": {
            "Easy": [
                "What is Object-Oriented Programming (OOP) and explain its four pillars.",
                "What is the difference between a process and a thread?",
                "What are the benefits of using Git version control?"
            ],
            "Medium": [
                "Explain the difference between compiled and interpreted programming languages.",
                "How do compilers resolve circular dependencies in imports?",
                "What is a deadlock and how can it be avoided?"
            ],
            "Hard": [
                "Explain how memory management works in languages with garbage collectors vs manual memory allocation.",
                "Explain the CAP theorem and its implications in distributed storage systems.",
                "What is the difference between optimistic locking and pessimistic locking?"
            ]
        },
        "Coding": {
            "Easy": [
                "Implement a function to check if a number is prime.",
                "Write a function to merge two sorted arrays."
            ],
            "Medium": [
                "Write a function to find the longest substring without repeating characters.",
                "Implement binary search on a rotated sorted array."
            ],
            "Hard": [
                "Write a function to solve the sliding window maximum problem.",
                "Solve the edit distance problem between two strings."
            ]
        },
        "System Design": {
            "Easy": [
                "What is a load balancer and where does it sit in an architecture?",
                "Explain the difference between SQL and NoSQL."
            ],
            "Medium": [
                "Design a simple parking lot management system (class diagram / API).",
                "Design a rate limiter for APIs."
            ],
            "Hard": [
                "Design a distributed search engine index similar to Elasticsearch.",
                "Design a highly available distributed file storage system like Google Cloud Storage."
            ]
        }
    },
    "AI/ML Engineer": {
        "Technical": {
            "Easy": [
                "What is the difference between supervised and unsupervised learning?",
                "Explain overfitting and underfitting.",
                "What is gradient descent?"
            ],
            "Medium": [
                "Explain the vanishing gradient problem and how to mitigate it.",
                "How does the self-attention mechanism work in Transformers?",
                "What is the difference between L1 and L2 regularization?"
            ],
            "Hard": [
                "Explain Retrieval-Augmented Generation (RAG) and how you optimize vector database chunking.",
                "How would you parallelize model training across multiple GPUs using data/model parallelism?",
                "Explain how reinforcement learning with human feedback (RLHF) aligns LLMs."
            ]
        },
        "Coding": {
            "Easy": [
                "Write a Python function to calculate the mean squared error (MSE).",
                "Implement simple linear regression update rules in NumPy."
            ],
            "Medium": [
                "Write a PyTorch script to build a simple feedforward neural network.",
                "Write a Python script to tokenize and create vocabulary mappings for a text dataset."
            ],
            "Hard": [
                "Write a PyTorch layer implementing multi-head self-attention from scratch.",
                "Write a script to implement beam search decoding for a sequence-to-sequence model."
            ]
        },
        "System Design": {
            "Easy": [
                "What is a vector database?",
                "Explain training data vs validation data split."
            ],
            "Medium": [
                "Design an end-to-end ML training pipeline for movie recommendations.",
                "Design an AI model serving layer to minimize latency."
            ],
            "Hard": [
                "Design a real-time semantic search engine for billions of documents.",
                "Design a distributed training and evaluation orchestrator for LLMs."
            ]
        }
    },
    "Game Developer": {
        "Technical": {
            "Easy": [
                "What is the game loop?",
                "Explain the difference between update and fixed update in Unity.",
                "What is a draw call?"
            ],
            "Medium": [
                "Explain vector math (dot product vs cross product) and their uses in game mechanics.",
                "What is object pooling and why is it essential for mobile game performance?",
                "How does collision detection work (broadphase vs narrowphase)?"
            ],
            "Hard": [
                "How do you optimize rendering bottlenecks (vertex bound vs pixel bound)?",
                "Explain how you would synchronize physics and state in a fast-paced multiplayer shooter.",
                "Design a dynamic memory manager for an custom C++ game engine."
            ]
        },
        "Coding": {
            "Easy": [
                "Write a script in C# to translate an object smoothly towards a target.",
                "Implement a simple state machine for a patrol enemy."
            ],
            "Medium": [
                "Write a custom spatial partitioning grid class in C# to optimize close-object searches.",
                "Implement an A* pathfinding heuristic algorithm."
            ],
            "Hard": [
                "Write a C++ component system manager to update entities in contiguous memory layouts.",
                "Implement a custom matrix transformation class for 3D rotation, scaling, and translation."
            ]
        },
        "System Design": {
            "Easy": [
                "What is Entity-Component-System (ECS) vs Object-Oriented game architecture?",
                "Explain asset streaming."
            ],
            "Medium": [
                "Design a modular inventory system supporting crafting and item stacks.",
                "Design a save-game serialization system for an offline RPG."
            ],
            "Hard": [
                "Design a matchmaking and server scaling orchestrator for a battle royale game.",
                "Design a custom shader and graphics pipeline structure for rendering cell-shaded environments."
            ]
        }
    }
}

SKILL_QUESTIONS = {
    "fastapi": {
        "Technical": "How does FastAPI leverage Pydantic and type hints for request validation and serialization?",
        "Coding": "Write a FastAPI route that uses Dependency Injection to retrieve a database session."
    },
    "react": {
        "Technical": "How does React Fiber differ from the older stack reconciler?",
        "Coding": "Write a custom React hook `usePrevious` to track the previous value of a state variable."
    },
    "docker": {
        "Technical": "What is the difference between a Docker image and a Docker container, and how do multi-stage builds work?",
        "System Design": "Explain how you would design a Docker Compose file to orchestrate a FastAPI backend, React frontend, and PostgreSQL database."
    },
    "aws": {
        "Technical": "Explain AWS IAM roles and how they differ from users. How do you securely authenticate EC2 instances to call S3?",
        "System Design": "Design a highly available architecture in AWS utilizing multi-AZ RDS, ALBs, and Auto-Scaling groups."
    },
    "machine learning": {
        "Technical": "Explain the bias-variance tradeoff and how regularization affects it.",
        "Coding": "Implement a simple k-means clustering algorithm in NumPy."
    },
    "dsa": {
        "Coding": "Implement a function to find the lowest common ancestor (LCA) in a binary tree.",
        "Technical": "Explain the difference between stable and unstable sorting algorithms, giving examples."
    },
    "unity": {
        "Technical": "What is the difference between Unity's built-in render pipeline, URP, and HDRP?",
        "Coding": "Write a C# script to implement a basic event bus pattern in Unity."
    }
}

def generate_interview_loop(role: str, difficulty: str, resume_skills: list) -> list:
    """
    Constructs an structured interview of 6 questions:
    - 1 HR (from HR_QUESTIONS, defaults to Easy or selected difficulty)
    - 2 Technical (prioritizing candidate's resumeSkills)
    - 2 Coding (prioritizing candidate's resumeSkills)
    - 1 System Design (prioritizing candidate's resumeSkills)
    """
    questions = []
    
    # 1. Select HR Question (label as Easy or select according to difficulty)
    hr_diff = "Easy" if difficulty == "Easy" else "Medium" if difficulty == "Medium" else "Hard"
    hr_pool = HR_QUESTIONS.get(hr_diff, HR_QUESTIONS["Easy"])
    questions.append({
        "category": "HR",
        "difficulty": "Easy" if difficulty == "Easy" else "Medium",
        "question": random.choice(hr_pool)
    })
    
    # Normalize resume skills for lookup
    skills_lower = [s.lower() for s in resume_skills] if resume_skills else []
    
    # 2. Select 2 Technical Questions
    tech_pool = ROLE_QUESTIONS.get(role, ROLE_QUESTIONS["Software Engineer"])["Technical"].get(difficulty, [])
    # Search for matching skill-specific technical questions
    skill_techs = []
    for skill in skills_lower:
        if skill in SKILL_QUESTIONS and "Technical" in SKILL_QUESTIONS[skill]:
            skill_techs.append(SKILL_QUESTIONS[skill]["Technical"])
            
    # Add prioritized skill questions
    selected_tech = []
    if skill_techs:
        selected_tech.append(random.choice(skill_techs))
        
    # Fill remaining from standard role technical pool
    remaining_tech = [q for q in tech_pool if q not in selected_tech]
    while len(selected_tech) < 2 and remaining_tech:
        chosen = random.choice(remaining_tech)
        selected_tech.append(chosen)
        remaining_tech.remove(chosen)
        
    for q in selected_tech:
        questions.append({
            "category": "Technical",
            "difficulty": difficulty,
            "question": q
        })
        
    # 3. Select 2 Coding Questions
    coding_pool = ROLE_QUESTIONS.get(role, ROLE_QUESTIONS["Software Engineer"])["Coding"].get(difficulty, [])
    skill_codings = []
    for skill in skills_lower:
        if skill in SKILL_QUESTIONS and "Coding" in SKILL_QUESTIONS[skill]:
            skill_codings.append(SKILL_QUESTIONS[skill]["Coding"])
            
    selected_coding = []
    if skill_codings:
        selected_coding.append(random.choice(skill_codings))
        
    remaining_coding = [q for q in coding_pool if q not in selected_coding]
    while len(selected_coding) < 2 and remaining_coding:
        chosen = random.choice(remaining_coding)
        selected_coding.append(chosen)
        remaining_coding.remove(chosen)
        
    for q in selected_coding:
        questions.append({
            "category": "Coding",
            "difficulty": difficulty,
            "question": q
        })
        
    # 4. Select 1 System Design Question
    sd_pool = ROLE_QUESTIONS.get(role, ROLE_QUESTIONS["Software Engineer"])["System Design"].get(difficulty, [])
    skill_sds = []
    for skill in skills_lower:
        if skill in SKILL_QUESTIONS and "System Design" in SKILL_QUESTIONS[skill]:
            skill_sds.append(SKILL_QUESTIONS[skill]["System Design"])
            
    selected_sd = []
    if skill_sds:
        selected_sd.append(random.choice(skill_sds))
        
    if not selected_sd and sd_pool:
        selected_sd.append(random.choice(sd_pool))
        
    for q in selected_sd:
        questions.append({
            "category": "System Design",
            "difficulty": difficulty,
            "question": q
        })
        
    return questions
