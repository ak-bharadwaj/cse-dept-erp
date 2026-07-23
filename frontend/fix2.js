const fs = require('fs');
let c = fs.readFileSync('src/context/AppContext.tsx', 'utf8');
c = c.replace('const loggedFaculty = roleFaculty();\\n  const loggedStudent = students.find(s => s.userId === user?.id) || null;', 'const loggedFaculty = roleFaculty();\n  const loggedStudent = students.find(s => s.userId === user?.id) || null;');
fs.writeFileSync('src/context/AppContext.tsx', c);
