# Onyx Architecture Overview

Welcome to the Onyx project! This document provides a high-level overview of the application's architecture, components, and development workflow. It's intended to help new team members get up to speed quickly.

## 1. High-Level Architecture

Onyx is a modern, containerized web application with a three-tier architecture:

1.  **Frontend (Web):** A Next.js/React single-page application that provides the user interface.
2.  **Backend:** A Python-based API server that handles business logic, data processing, and communication with other services. It includes a primary application server and a dedicated model server for AI/ML tasks.
3.  **Deployment & Infrastructure:** A collection of configurations for containerization (Docker) and deployment on various platforms like Docker Compose, Kubernetes (Helm), and AWS ECS.

These components are designed to be decoupled, communicating over well-defined APIs, which allows for independent development, scaling, and deployment.

---

## 2. Core Components

### 2.1. Frontend (`/web`)

The frontend is a modern web application built with TypeScript and the Next.js framework for React.

-   **Framework:** [Next.js](https://nextjs.org/) (React)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/) with custom themes located in `/tailwind-themes`.
-   **UI Components:** Managed via `components.json`, likely using a library like [shadcn/ui](https://ui.shadcn.com/).
-   **Testing:**
    -   End-to-End: [Playwright](https://playwright.dev/) (`playwright.config.ts`)
    -   Unit/Integration: [Jest](https://jestjs.io/) (`jest.config.js`)
-   **Key Directories:**
    -   `src/`: Contains the core application source code, following standard Next.js structure (`pages` or `app` directory, `components`, `lib`, etc.).
    -   `public/`: Static assets like images and fonts.
    -   `tests/`: Playwright E2E tests.

### 2.2. Backend (`/backend`)

The backend is built using Python and is responsible for the core business logic of the application. It appears to be composed of two main services: the main API server and a dedicated model inference server.

-   **Language:** [Python](https://www.python.org/)
-   **Framework:** Likely a modern async framework like [FastAPI](https://fastapi.tiangolo.com/) or [Flask](https://flask.palletsprojects.com/), given the structure.
-   **Dependencies:** Managed by `pyproject.toml` and specified in the `/requirements` directory.
-   **Database & Migrations:** Uses SQL, with [Alembic](https://alembic.sqlalchemy.org/) for database schema migrations (`alembic.ini`, `alembic/`). This suggests the use of [SQLAlchemy](https://www.sqlalchemy.org/) as the ORM.
-   **Key Directories & Modules:**
    -   `onyx/`: The main Python package containing the core application logic.
        -   `main.py`: The entry point for the application server.
        -   `server/`: API endpoint definitions.
        -   `db/`: Database models, session management, and repository patterns.
        -   `auth/`: Authentication and authorization logic.
        -   `chat/`: Core logic for the chat functionality.
        -   `connectors/`: Manages connections to external data sources (e.g., Jira, Confluence, Zendesk).
        -   `llm/`: Logic for interacting with Large Language Models (LLMs).
        -   `background/`: Celery or a similar task queue for background job processing.
    -   `model_server/`: A dedicated service for hosting and serving machine learning models (e.g., for embeddings or custom NLP tasks). It communicates with the main backend.
    -   `tests/`: Pytest-based tests for the backend application.
    -   `scripts/`: Various utility and maintenance scripts.

### 2.3. Deployment & Infrastructure (`/deployment`)

This directory contains all the necessary configurations to build, run, and deploy the Onyx application.

-   **Containerization:** [Docker](https://www.docker.com/). `Dockerfile`s are present in both the `backend` and `web` directories.
-   **Local Development:** [Docker Compose](https://docs.docker.com/compose/) (`deployment/docker_compose`) is used to orchestrate all the services (frontend, backend, database, etc.) for a local development environment.
-   **Cloud Deployment:**
    -   **Kubernetes:** [Helm charts](https://helm.sh/) (`deployment/helm`) are provided for deploying Onyx to a Kubernetes cluster.
    -   **AWS:** Specific configurations for deploying to [AWS ECS Fargate](https://aws.amazon.com/fargate/) (`deployment/aws_ecs_fargate`).

---

## 3. Development Workflow & CI/CD

The project has a mature development workflow enforced by automation.

-   **Pre-commit Hooks:** The `.pre-commit-config.yaml` file defines hooks that run linters (like Prettier) and formatters before code is committed, ensuring consistent code style.
-   **CI/CD:** The `.github/workflows` directory contains a comprehensive set of [GitHub Actions](https://github.com/features/actions) for continuous integration and deployment.
    -   **Pull Request Checks:** On every PR, workflows run linters, type-checkers, and automated tests for the frontend (`pr-python-checks.yml`) and backend (`pr-playwright-tests.yml`).
    -   **Container Builds:** Workflows automatically build and push Docker images to a container registry when new tags are created (e.g., `docker-build-push-backend-container-on-tag.yml`).
-   **Contributing Guidelines:** The `CONTRIBUTING.md` files provide detailed instructions for setting up the development environment and contributing to the project.

---

## 4. How It All Works Together

1.  A user interacts with the **Frontend** (Next.js app) in their browser.
2.  The Frontend sends API requests (e.g., to send a chat message, configure a connector) to the **Backend** API server.
3.  The **Backend** processes the request. This may involve:
    -   Authenticating the user (`auth` module).
    -   Reading/writing data to the database (`db` module).
    -   Fetching data from an external source via a `connector`.
    -   Placing a long-running task on a background queue (`background` module).
4.  For AI-powered features (e.g., generating a response, semantic search), the Backend sends a request to the dedicated **Model Server**, which performs the computation and returns the result.
5.  The entire application is run as a set of interconnected **Docker containers**, which can be managed locally with `docker-compose` or deployed to the cloud with `helm` or other provided scripts.
