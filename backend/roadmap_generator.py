# Role-specific base roadmaps
ROLE_ROADMAP_TEMPLATES = {
    "Frontend": [
        {
            "topic": "Advanced TypeScript & ES6+",
            "project": "Build an asynchronous state manager using TypeScript proxies.",
            "hours": 6,
            "resources": ["TypeScript Deep Dive Guide", "MDN JavaScript Reference"],
            "difficulty": "Medium",
            "is_gap": False
        },
        {
            "topic": "Component Architecture with React",
            "project": "Create a reusable, highly accessible UI component library with Tailwind CSS.",
            "hours": 10,
            "resources": ["React Components Docs", "W3C accessibility guidelines"],
            "difficulty": "Medium",
            "is_gap": False
        },
        {
            "topic": "Next.js SSR & Incremental Regeneration",
            "project": "Build a static blog with Next.js dynamic routing and static regeneration.",
            "hours": 12,
            "resources": ["Next.js Learning Course", "Vercel SSR architecture guide"],
            "difficulty": "Hard",
            "is_gap": False
        },
        {
            "topic": "State Management with Zustand",
            "project": "Build a shopping cart application using Zustand and custom React hooks.",
            "hours": 8,
            "resources": ["Zustand Guide", "State patterns in React"],
            "difficulty": "Medium",
            "is_gap": False
        }
    ],
    "Backend": [
        {
            "topic": "Docker Basics",
            "project": "Containerize a FastAPI project using multi-stage builds.",
            "hours": 8,
            "resources": ["Docker Docs", "FastAPI container guide"],
            "difficulty": "Easy",
            "is_gap": False
        },
        {
            "topic": "API Design with FastAPI",
            "project": "Implement a CRUD REST API with JWT authentication and Pydantic validation.",
            "hours": 10,
            "resources": ["FastAPI Tutorial", "Pydantic Documentation"],
            "difficulty": "Medium",
            "is_gap": False
        },
        {
            "topic": "Database Indexing & PostgreSQL",
            "project": "Create a schema with index optimizations and run query analyzer plans.",
            "hours": 10,
            "resources": ["PostgreSQL Tutorial", "Use The Index, Luke guide"],
            "difficulty": "Medium",
            "is_gap": False
        },
        {
            "topic": "Caching & Task Queues",
            "project": "Orchestrate asynchronous tasks with Celery and Redis in a backend application.",
            "hours": 12,
            "resources": ["Redis Crash Course", "Celery Getting Started Guide"],
            "difficulty": "Hard",
            "is_gap": False
        }
    ],
    "AI": [
        {
            "topic": "Machine Learning with Scikit-Learn",
            "project": "Build a classification pipeline to predict customer churn.",
            "hours": 8,
            "resources": ["Scikit-learn Documentation", "Hands-on ML Book"],
            "difficulty": "Easy",
            "is_gap": False
        },
        {
            "topic": "Deep Learning & PyTorch",
            "project": "Train a convolutional neural network (CNN) on ImageNet/CIFAR-10.",
            "hours": 12,
            "resources": ["PyTorch Tutorials", "Deep Learning Book"],
            "difficulty": "Medium",
            "is_gap": False
        },
        {
            "topic": "Natural Language Processing (NLP)",
            "project": "Fine-tune a BERT model for text sentiment classification.",
            "hours": 12,
            "resources": ["HuggingFace NLP Course", "Attention Is All You Need Paper"],
            "difficulty": "Hard",
            "is_gap": False
        },
        {
            "topic": "RAG & LangChain",
            "project": "Build a Q&A chatbot over PDF documents using Pinecone vector database and LangChain.",
            "hours": 10,
            "resources": ["LangChain Docs", "Pinecone Vector Search Guide"],
            "difficulty": "Hard",
            "is_gap": False
        }
    ],
    "Game Development": [
        {
            "topic": "C# Scripting & Scriptable Objects in Unity",
            "project": "Implement a modular inventory system in Unity using C# scriptable objects.",
            "hours": 8,
            "resources": ["Unity Learn - Scripting", "C# Programming Guide"],
            "difficulty": "Easy",
            "is_gap": False
        },
        {
            "topic": "C++ Memory Management in Unreal Engine",
            "project": "Implement a custom memory pooling subsystem inside Unreal Engine.",
            "hours": 12,
            "resources": ["Unreal C++ Documentation", "Effective C++ Book"],
            "difficulty": "Hard",
            "is_gap": False
        },
        {
            "topic": "Game Physics & Vector Mathematics",
            "project": "Write a 3D projectile trajectory prediction script with air resistance.",
            "hours": 10,
            "resources": ["Essential Mathematics for Games", "Unity Physics Guide"],
            "difficulty": "Medium",
            "is_gap": False
        },
        {
            "topic": "Object Pooling & Rendering Optimization",
            "project": "Build a bullet-hell particle engine utilizing object pools and batching.",
            "hours": 10,
            "resources": ["Game Programming Patterns", "Unity Profiling Course"],
            "difficulty": "Medium",
            "is_gap": False
        }
    ],
    "Data Science": [
        {
            "topic": "Data Wrangling with Pandas & NumPy",
            "project": "Clean and preprocess a dataset of housing prices to perform exploratory data analysis.",
            "hours": 6,
            "resources": ["Pandas Documentation", "Kaggle Data Cleaning Course"],
            "difficulty": "Easy",
            "is_gap": False
        },
        {
            "topic": "Data Visualization & Dashboarding",
            "project": "Create an interactive dashboard using Streamlit to visualize sales trends.",
            "hours": 8,
            "resources": ["Streamlit Documentation", "Matplotlib / Seaborn Guides"],
            "difficulty": "Easy",
            "is_gap": False
        },
        {
            "topic": "SQL & Relational Databases",
            "project": "Write complex analytical SQL queries (window functions, subqueries) to analyze user behavior.",
            "hours": 8,
            "resources": ["SQL Bolt Interactive Course", "LeetCode Database Problems"],
            "difficulty": "Medium",
            "is_gap": False
        },
        {
            "topic": "Feature Engineering & Demand Forecasting",
            "project": "Build a pipeline to engineer features and fit an XGBoost model for demand forecasting.",
            "hours": 12,
            "resources": ["XGBoost Docs", "Feature Engineering for ML Guide"],
            "difficulty": "Hard",
            "is_gap": False
        }
    ],
    "Cybersecurity": [
        {
            "topic": "Linux Systems & Networking Basics",
            "project": "Set up a secure Linux firewall using iptables and configure a private subnet.",
            "hours": 8,
            "resources": ["Linux Command Line Guide", "Computer Networks Book"],
            "difficulty": "Easy",
            "is_gap": False
        },
        {
            "topic": "Web Application Security & OWASP Top 10",
            "project": "Set up a vulnerable web application (DVWA) and execute/mitigate SQL Injection and XSS attacks.",
            "hours": 10,
            "resources": ["OWASP Top 10 Security Guide", "PortSwigger Web Security Academy"],
            "difficulty": "Medium",
            "is_gap": False
        },
        {
            "topic": "Cryptography & PKI",
            "project": "Write a Python script to perform RSA encryption/decryption and verify digital signatures.",
            "hours": 10,
            "resources": ["Practical Cryptography", "Python Cryptography Library Docs"],
            "difficulty": "Medium",
            "is_gap": False
        },
        {
            "topic": "Penetration Testing & Threat Hunting",
            "project": "Perform a network security audit on a mock server using Nmap and Metasploit, documenting vulnerabilities.",
            "hours": 12,
            "resources": ["Metasploit Unleashed", "Nmap Reference Guide"],
            "difficulty": "Hard",
            "is_gap": False
        }
    ]
}

# Mapping of specific skill gaps to targeted learning weeks
SKILL_ROADMAP_WEEKS = {
    "docker": {
        "topic": "Docker Containerization",
        "project": "Containerize your target application with multi-stage builds.",
        "hours": 8,
        "resources": ["Docker Docs", "Container Best Practices"],
        "difficulty": "Medium",
        "is_gap": True
    },
    "kubernetes": {
        "topic": "Kubernetes Orchestration",
        "project": "Deploy your containerized service to a local Minikube cluster.",
        "hours": 12,
        "resources": ["Kubernetes Basics", "Minikube Setup Guide"],
        "difficulty": "Hard",
        "is_gap": True
    },
    "fastapi": {
        "topic": "FastAPI Web Services",
        "project": "Build an asynchronous CRUD REST API with OpenAPI validation.",
        "hours": 10,
        "resources": ["FastAPI Tutorial", "Async/Await in Python"],
        "difficulty": "Medium",
        "is_gap": True
    },
    "react": {
        "topic": "React State & Component Lifecycle",
        "project": "Build a responsive dashboard using React hooks and context.",
        "hours": 10,
        "resources": ["React Docs", "State Hooks Tutorial"],
        "difficulty": "Medium",
        "is_gap": True
    },
    "aws": {
        "topic": "Cloud Deployment on AWS",
        "project": "Deploy your backend service to AWS ECS with RDS database integration.",
        "hours": 12,
        "resources": ["AWS ECS Getting Started", "Amazon RDS Documentation"],
        "difficulty": "Hard",
        "is_gap": True
    },
    "tensorflow": {
        "topic": "Deep Learning with TensorFlow",
        "project": "Build and train a classification neural network using Keras API.",
        "hours": 12,
        "resources": ["TensorFlow Tutorials", "Keras Guide"],
        "difficulty": "Hard",
        "is_gap": True
    },
    "pytorch": {
        "topic": "Deep Learning with PyTorch",
        "project": "Implement a feedforward neural network and optimization loop in PyTorch.",
        "hours": 12,
        "resources": ["PyTorch Tutorials", "Neural Networks Guide"],
        "difficulty": "Hard",
        "is_gap": True
    },
    "mongodb": {
        "topic": "NoSQL Database Integration with MongoDB",
        "project": "Design a schema-less storage layer for a document blogging application.",
        "hours": 8,
        "resources": ["MongoDB University", "Mongoose Docs"],
        "difficulty": "Medium",
        "is_gap": True
    },
    "mysql": {
        "topic": "Relational Databases with MySQL",
        "project": "Design schemas, indexes, and write complex JOIN queries.",
        "hours": 8,
        "resources": ["MySQL Tutorial", "Relational Database Design principles"],
        "difficulty": "Medium",
        "is_gap": True
    },
    "postgresql": {
        "topic": "Advanced Relational Databases with PostgreSQL",
        "project": "Set up database triggers, stored procedures, and optimize query latency.",
        "hours": 10,
        "resources": ["Postgres Documentation", "Indexing Optimizations Guide"],
        "difficulty": "Hard",
        "is_gap": True
    },
    "git": {
        "topic": "Version Control with Git",
        "project": "Collaborate on a repository using branches, merge conflict resolutions, and rebases.",
        "hours": 6,
        "resources": ["Git Book", "GitHub interactive guides"],
        "difficulty": "Easy",
        "is_gap": True
    },
    "github": {
        "topic": "Git & GitHub Workflows",
        "project": "Create a collaborative repository using branch protections and Pull Requests.",
        "hours": 6,
        "resources": ["GitHub Docs", "Collaboration best practices"],
        "difficulty": "Easy",
        "is_gap": True
    },
    "github actions": {
        "topic": "CI/CD with GitHub Actions",
        "project": "Set up a workflow to run automated lint checks and test suites on pull requests.",
        "hours": 8,
        "resources": ["GitHub Actions Docs", "CI/CD pipelines overview"],
        "difficulty": "Medium",
        "is_gap": True
    },
    "terraform": {
        "topic": "Infrastructure as Code with Terraform",
        "project": "Provision a secure virtual private cloud (VPC) with security groups using Terraform.",
        "hours": 10,
        "resources": ["HashiCorp Learn Terraform", "VPC module configuration guide"],
        "difficulty": "Hard",
        "is_gap": True
    },
    "dsa": {
        "topic": "Algorithms & Data Structures Practice",
        "project": "Solve 15 medium-difficulty coding challenges on LeetCode/HackerRank.",
        "hours": 12,
        "resources": ["LeetCode Patterns", "Algorithms course"],
        "difficulty": "Hard",
        "is_gap": True
    }
}

def generate_study_plan(resume_skills: list, missing_skills: list, target_role: str) -> dict:
    """
    Assembles a study roadmap tailored to the target role.
    Integrates identified skill gaps as high-priority focus areas at the beginning of the plan.
    """
    # 1. Fetch base roadmap for target role
    base_roadmap = list(ROLE_ROADMAP_TEMPLATES.get(target_role, ROLE_ROADMAP_TEMPLATES["Backend"]))
    
    # 2. Identify missing skills that have specific study templates
    missing_lower = [s.lower() for s in missing_skills] if missing_skills else []
    gap_weeks = []
    
    # Track existing topics to avoid duplicates
    existing_topics = set(w["topic"].lower() for w in base_roadmap)
    
    for skill in missing_lower:
        if skill in SKILL_ROADMAP_WEEKS:
            week_data = SKILL_ROADMAP_WEEKS[skill]
            # Avoid duplicating topics
            if week_data["topic"].lower() not in existing_topics:
                gap_weeks.append(dict(week_data))
                existing_topics.add(week_data["topic"].lower())
                
    # 3. Combine gap weeks (priority focus) and base roadmap weeks
    combined_weeks = gap_weeks + base_roadmap
    
    # 4. Formulate week numbers dynamically
    final_weeks = []
    for index, week in enumerate(combined_weeks):
        final_weeks.append({
            "week": index + 1,
            "topic": week["topic"],
            "project": week["project"],
            "hours": week["hours"],
            "resources": week["resources"],
            "difficulty": week["difficulty"],
            "is_gap": week["is_gap"]
        })
        
    return {
        "weeks": final_weeks
    }
