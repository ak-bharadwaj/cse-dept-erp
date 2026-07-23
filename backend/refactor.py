import os
import re

# We will read app.controller.ts and app.service.ts
# and split them into 10 modules: 
# Auth, Student, Faculty, Academic, Attendance, InternalAssessment(Wait, Academic covers it?), Event, Placement, Research, Document, Audit (Audit & Calendar)
# Wait, PrismaModule is already there.

print('Refactoring backend...')
