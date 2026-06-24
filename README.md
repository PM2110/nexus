# Nexus

### Real-Time Collaborative Problem Solving Platform for Developers

Nexus is a production-ready collaborative coding workspace designed for developers, students, interview candidates, mentors, and competitive programmers who want to solve coding problems together in real time.

Unlike traditional coding platforms that limit participants to a single shared editor, Nexus introduces a multi-workspace collaborative environment where users can explore multiple approaches simultaneously, compare solutions, share ideas, and learn together while remaining connected through a unified problem-solving experience.

Nexus combines the collaborative experience of Google Docs, the editing experience of VS Code, and the structured workflow of coding interview platforms into a single seamless product.

---

# Vision

Modern coding platforms are built primarily for individual problem solving.

When developers want to collaborate, they typically rely on:

* Screen sharing tools
* Video conferencing platforms
* VS Code Live Share
* External chat applications

These workflows create unnecessary friction and fail to provide a dedicated environment for collaborative algorithmic problem solving.

Nexus aims to become:

> The default workspace for collaborative coding interviews, DSA preparation, pair programming, and competitive programming discussions.

---

# Problem Statement

Current solutions suffer from several limitations:

### Coding Platforms

Platforms such as LeetCode focus heavily on individual problem solving.

Limitations:

* Single-user experience
* Limited collaboration support
* No structured multi-solution exploration
* No dedicated collaborative learning environment

### Screen Sharing Solutions

Teams often use:

* Discord
* Zoom
* Google Meet

Limitations:

* No shared coding workspace
* No synchronized problem context
* No integrated code execution
* Difficult collaboration workflow

### Live Share Solutions

Tools such as VS Code Live Share provide code synchronization but lack:

* Problem management
* Interview workflows
* Collaborative note taking
* Session replay
* Structured learning environments

---

# Core Concept

A user creates a workspace.

Participants join using an invite link.

A coding problem is imported from a supported platform.

The workspace automatically generates a default collaborative sheet visible to everyone. Participants can dynamically create additional sheets, choosing to keep them visible to everyone or restricting visibility to selected users for private drafts or small-group collaboration.

---

# Key Features

## Authentication & User Management

### Features

* Google Authentication
* GitHub Authentication
* JWT Authentication
* Secure Session Management
* User Profiles

---

## Workspace Management

### Features

* Create Workspace
* Join Workspace
* Invite Participants
* Workspace Roles

Roles:

* Owner
* Editor
* Viewer

---

## Problem Import System

### Initial Platform Support

* LeetCode

### Future Platform Support

* Codeforces
* CodeChef
* GeeksForGeeks
* HackerRank
* AtCoder

### Imported Metadata

* Title
* Difficulty
* Description
* Examples
* Constraints
* Hints
* Tags

---

## Multi-Sheet Collaborative Architecture

### Default Public Sheets

Synchronized coding environments where all participants collaborate on a common sheet by default.

Use Cases:

* Pair Programming
* Collaborative Debugging
* Final Submission Reviews

---

### Restricted Custom Sheets

Dynamically created coding environments where the creator selects which specific users can view or edit the sheet.

Use Cases:

* Exploring alternative solutions privately
* Independent brainstorming in a sandbox
* Mentorship check-ins with limited visibility

---

### Notes Workspace

Collaborative text note sheets visible to all participants.

* Observations
* Complexity Analysis
* Edge Cases
* Interview Notes
* Problem Breakdown

---

## Real-Time Collaboration Engine

### Features

* Live Code Synchronization
* Cursor Presence
* Selection Highlighting
* User Presence Indicators
* Active Workspace Tracking

Display Information:

* User Name
* Active Sheet
* Cursor Position
* Online Status

---

## Monaco Editor Integration

### Features

* VS Code Experience
* Syntax Highlighting
* IntelliSense Support
* Theme Support
* Keyboard Shortcuts
* Multi-Language Support

Supported Languages:

* JavaScript
* TypeScript
* Python
* Java
* C++
* Go

---

## Code Execution System

### Features

* Run Code
* Custom Input
* Console Output
* Runtime Errors
* Execution Metrics

Execution Modes:

* Sample Test Cases
* Custom Test Cases

---

## Test Case Management

### Features

* Imported Test Cases
* Custom Test Cases
* Save Test Cases
* Re-run Execution

---

## Workspace Chat

### Features

* Real-Time Messaging
* Code Snippets
* Mentions
* Contextual Discussions

---

## Presence System

### Features

* Active User Tracking
* Typing Indicators
* Current Sheet Indicators
* Join/Leave Notifications

Examples:

* Manan editing Shared Sheet
* Alex viewing Personal Sheet
* Sarah testing solution

---

## Session Replay

### Features

Replay complete problem-solving sessions.

Includes:

* Code Evolution
* Cursor Playback
* Sheet Navigation
* Execution History

Use Cases:

* Learning
* Mentorship
* Interview Review

---

## Whiteboard

### Features

* Draw Trees
* Draw Graphs
* Draw System Designs
* Architecture Discussions

Use Cases:

* Graph Algorithms
* Dynamic Programming Visualization
* Interview Explanations

---

## Solution Comparison

### Features

Compare:

* Shared Solution
* Personal Solutions
* Final Solution

Capabilities:

* Side-by-Side View
* Diff Visualization
* Approach Analysis

---

## Blind Interview Mode

Designed for technical interviews.

### Candidate View

Visible:

* Problem Statement
* Coding Environment

Hidden:

* Interviewer Notes
* Evaluation Metrics

### Interviewer View

Capabilities:

* Observe Candidate Activity
* Leave Notes
* Evaluate Performance

---

# Technical Architecture

## Frontend

### Framework

React

### Language

TypeScript

### Build Tool

Vite

### Styling

Tailwind CSS

### State Management

Zustand

### Data Fetching

TanStack Query

### Editor

Monaco Editor

### Collaborative Engine

Yjs

### Realtime Client

Socket.IO Client

---

## Backend

### Runtime

Node.js

### Framework

Express.js

### Language

TypeScript

### API Layer

REST APIs

### Realtime Layer

Socket.IO

### Collaboration Server

Yjs WebSocket Server

---

## Database

### Primary Database

PostgreSQL

### ORM

Prisma

---

## Cache Layer

Redis

Use Cases:

* Presence Tracking
* Workspace State
* Rate Limiting
* Session Metadata

---

## Authentication

OAuth Providers:

* Google
* GitHub

Authentication Strategy:

* JWT Access Tokens
* Refresh Tokens

---

## Code Execution

### MVP

Judge0 API

### Future

Self-Hosted Sandbox Infrastructure

Options:

* Docker Isolation
* Firecracker MicroVMs

---

## Storage

Object Storage:

AWS S3

Stored Assets:

* Session Replays
* Whiteboard Data
* Workspace Files

---

# Realtime Architecture

Client A
↕
Socket.IO
↕
Collaboration Server
↕
Yjs Document State
↕
Presence Layer
↕
Workspace State
↕
Client B

Synchronizes:

* Code Changes
* Cursor Positions
* Notes
* Whiteboard Actions
* Workspace Metadata

---

# Database Design

## Users

* id
* name
* email
* avatar
* provider

---

## Workspaces

* id
* name
* owner_id
* invite_code
* created_at

---

## Workspace Members

* id
* workspace_id
* user_id
* role

---

## Problems

* id
* platform
* title
* url
* difficulty

---

## Sheets

* id
* workspace_id
* name
* is_public
* allowed_users (relationship or array)

---

## Executions

* id
* sheet_id
* language
* output
* runtime
* executed_at

---

## Messages

* id
* workspace_id
* sender_id
* content

---

# MVP Scope

Version 1 focuses exclusively on validating collaborative problem solving.

Included:

* Authentication
* Workspace Creation
* Invite Links
* LeetCode URL Import
* Monaco Editor
* Shared Sheets
* Personal Sheets
* Real-Time Collaboration
* Cursor Presence
* Language Switching
* Code Execution
* Custom Test Cases
* Workspace Chat

Excluded:

* Whiteboard
* Session Replay
* Blind Interview Mode
* AI Features
* Additional Platforms
* Video Calling

---

# Future Roadmap

### Version 2

* Whiteboard
* Session Replay
* Solution Comparison
* Activity Timeline

### Version 3

* Video Calling
* Competitive Programming Rooms
* Classroom Mode
* Contest Mode

### Version 4

* AI Assistant
* AI Interviewer
* Automatic Solution Analysis
* Personalized Learning Recommendations

---

# Expected Outcome

Nexus provides developers with a structured collaborative environment where they can:

* Solve problems together
* Compare approaches
* Conduct mock interviews
* Learn collaboratively
* Practice pair programming
* Review complete coding sessions

The platform aims to become the collaborative layer missing from modern coding interview and competitive programming ecosystems.

