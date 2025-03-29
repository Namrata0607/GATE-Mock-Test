## Demo Objects for GATE Mock Test Schemas

### 1. User Schema
```json
{
    "name": "John Doe",
    "email": "johndoe@example.com",
    "password": "hashed_password",
    "branch": "CSE",
    "attemptedTest": [
        {
            "testId": "65a3d8f4e1a3d4a5b6c7d8e9",
            "questions": [
                {
                    "queId": "65a3d8f4e1a3d4a5b6c7d8e1",
                    "queImg": "https://example.com/question1.png",
                    "obtainedMarks": 2,
                    "correctAnswer": "B",
                    "attemptedStatus": true
                }
            ]
        }
    ]
}
```

### 2. Staff Schema
```json
{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "hashed_password"
}
```

### 3. Branch Schema
```json
{
    "branchName": "Computer Science & Engineering",
    "subjects": [
        "65a3d8f4e1a3d4a5b6c7d8e2",
        "65a3d8f4e1a3d4a5b6c7d8e3"
    ]
}
```

### 4. Subject Schema
```json
{
    "name": "Operating Systems",
    "abr": "OS",
    "questions": [
        "65a3d8f4e1a3d4a5b6c7d8e4",
        "65a3d8f4e1a3d4a5b6c7d8e5"
    ]
}
```

### 5. Question Schema
```json
{
    "question": "What is the time complexity of QuickSort in the worst case?",
    "queImg": "https://example.com/question2.png",
    "options": ["O(n log n)", "O(n^2)", "O(n)", "O(log n)"],
    "correctAnswer": ["O(n^2)"],
    "queType": "MCQ",
    "negativeMark": true,
    "mark": 2
}
```

### 6. Test Schema
```json
{
    "name": "GATE CSE Mock Test 1",
    "branch": "65a3d8f4e1a3d4a5b6c7d8e6",
    "subjects": [
        {
            "subject": "65a3d8f4e1a3d4a5b6c7d8e2",
            "questions": [
                "65a3d8f4e1a3d4a5b6c7d8e4",
                "65a3d8f4e1a3d4a5b6c7d8e5"
            ]
        }
    ],
    "totalMarks": 65,
    "sectionwiseMarks": {
        "aptitude": 15,
        "technical": 50
    },
    "createdBy": "65a3d8f4e1a3d4a5b6c7d8e7",
    "createdAt": "2025-03-28T10:00:00.000Z"
}
```

This structure should provide a well-organized database model for your GATE mock test application. Let me know if you need modifications! 🚀

