const express = require('express');
const mssql = require('mssql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;


app.use(bodyParser.json());
app.use(cors());


const dbConfig = {
  user: 'saikatdam',
  password: 'dam@123',
  server: '192.168.10.113',
  port: 1433,
  database: 'TMSIntern',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
 
};


mssql.connect(dbConfig).then(pool => {
  if (pool.connected) {
    console.log('Connected to MSSQL');

    app.get('/api/employees', async (req, res) => {
      try {
        const result = await pool.request().query('SELECT * FROM Employees');
        res.status(200).json(result.recordset);
      } catch (err) {
        console.error('Error executing query:', err.message);
        res.status(500).send('Internal Server Error');
      }
    });
    app.get('/api/departments', async (req, res) => {
      try {
        const result = await pool.request().query('SELECT * FROM Departments');
        res.status(200).json(result.recordset);
      } catch (err) {
        console.error('Error executing query:', err.message);
        res.status(500).send('Internal Server Error');
      }
    });
    app.get('/api/projects', async (req, res) => {
      try {
        const result = await pool.request().query('SELECT * FROM Project');
        res.status(200).json(result.recordset);
      } catch (err) {
        console.error('Error executing query:', err.message);
        res.status(500).send('Internal Server Error');
      }
    });
    app.get('/api/tasks', async (req, res) => {
      try {
        const result = await pool.request().query('SELECT * FROM Task');
        res.status(200).json(result.recordset);
      } catch (err) {
        console.error('Error executing query:', err.message);
        res.status(500).send('Internal Server Error');
      }
    });
    app.get('/api/teams', async (req, res) => {
      try {
        const result = await pool.request().query('SELECT * FROM Team');
        res.status(200).json(result.recordset);
      } catch (err) {
        console.error('Error executing query:', err.message);
        res.status(500).send('Internal Server Error');
      }
    });
    app.get('/api/teammembers', async (req, res) => {
      try {
        const result = await pool.request().query('SELECT * FROM TeamMembers');
        res.status(200).json(result.recordset);
      } catch (err) {
        console.error('Error executing query:', err.message);
        res.status(500).send('Internal Server Error');
      }
    });

    app.post('/api/createdepartment', async (req, res) => {
      const { deptName, deptSize, deptType } = req.body;

      if (!deptName || !deptSize || !deptType) {
          return res.status(400).json({ error: 'All fields are required: DeptName, DeptSize, DeptType.' });
      }
  
      try {
          const query = `
              INSERT INTO Departments (DeptName, DeptSize, DeptType)
              VALUES (@DeptName, @DeptSize, @DeptType)
          `;
  
          const poolRequest = pool.request();
          poolRequest.input('DeptName', deptName);
          poolRequest.input('DeptSize', deptSize);
          poolRequest.input('DeptType', deptType);
  
          await poolRequest.query(query);
  
          res.status(201).json({ message: 'Department created successfully.' });
      } catch (err) {
          console.error('Error executing query:', err.message);
          res.status(500).send('Internal Server Error');
      }
  });

  app.put('/api/updatedepartment/:id', async (req, res) => {
    const { id } = req.params; 
    const { deptName, deptSize, deptType } = req.body;

    if (!id || !deptName || !deptSize || !deptType) {
        return res.status(400).json({
            error: 'All fields are required: DeptName, DeptSize, DeptType, and a valid ID.'
        });
    }

    try {
        const query = `
            UPDATE Departments
            SET DeptName = @DeptName,
                DeptSize = @DeptSize,
                DeptType = @DeptType
            WHERE DeptId = @Id
        `;

        const poolRequest = pool.request();
        poolRequest.input('Id', id); 
        poolRequest.input('DeptName', deptName);
        poolRequest.input('DeptSize', deptSize);
        poolRequest.input('DeptType', deptType);

        const result = await poolRequest.query(query);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Department not found.' });
        }

        res.status(200).json({ message: 'Department updated successfully.' });
    } catch (err) {
        console.error('Error executing query:', err.message);
        res.status(500).send('Internal Server Error');
    }
});

  

    app.put('/api/updatephone/:id', async (req, res) => {
      const { id } = req.params;
      const { phoneNumber } = req.body;

      if (!phoneNumber) {
        return res.status(400).send('Phone number is required');
      }

      try {

        const result = await pool.request()
          .input('EmployeeId', mssql.Int, id)
          .input('PhoneNumber', mssql.NVarChar, phoneNumber)
          .input('ModifiedOn', mssql.DateTime, new Date())
          .query('UPDATE Employees SET PhoneNumber = @PhoneNumber, ModifiedOn = @ModifiedOn WHERE EmployeeId = @EmployeeId');

        if (result.rowsAffected[0] > 0) {
          res.status(200).send('Phone number updated successfully');
        } else {
          res.status(404).send('Employee not found');
        }
      } catch (err) {
        console.error('Error updating phone number:', err.message);
        res.status(500).send('Internal Server Error');
      }
    });


    app.put('/api/updateaddress/:id', async (req, res) => {
      const { id } = req.params;
      const { address } = req.body;


      if (!address) {
        return res.status(400).send('Address is required');
      }

      try {

        const result = await pool.request()
          .input('EmployeeId', mssql.Int, id)
          .input('Address', mssql.NVarChar, address)
          .input('ModifiedOn', mssql.DateTime, new Date())
          .query(`
        UPDATE Employees 
        SET Address = @Address, ModifiedOn = @ModifiedOn 
        WHERE EmployeeId = @EmployeeId
      `);

        if (result.rowsAffected[0] > 0) {
          res.status(200).send('Address updated successfully');
        } else {
          res.status(404).send('Employee not found');
        }
      } catch (err) {
        console.error('Error updating address:', err.message);
        res.status(500).send('Internal Server Error');
      }
    });


    app.put('/api/updaterole/:id', async (req, res) => {
      const { id } = req.params;
      const { role } = req.body;


      if (!role) {
        return res.status(400).send('Role is required');
      }

      try {

        const result = await pool.request()
          .input('EmployeeId', mssql.Int, id)
          .input('Role', mssql.NVarChar, role)
          .input('ModifiedOn', mssql.DateTime, new Date())
          .query(`
        UPDATE Employees 
        SET Role = @Role, ModifiedOn = @ModifiedOn 
        WHERE EmployeeId = @EmployeeId
      `);

        if (result.rowsAffected[0] > 0) {
          res.status(200).send('Role updated successfully');
        } else {
          res.status(404).send('Employee not found');
        }
      } catch (err) {
        console.error('Error updating role:', err.message);
        res.status(500).send('Internal Server Error');
      }
    });



    app.put('/api/assigndepartment/:id', async (req, res) => {
      console.log('Request Body:', req.body); 
      console.log('Request Params:', req.params); 
  
      const { id } = req.params;
      const { departmentName } = req.body;
  
      if (!departmentName) {
          return res.status(400).send('Department is required');
      }
  
      try {
          const result = await pool.request()
              .input('EmployeeId', mssql.Int, id)
              .input('Department', mssql.NVarChar, departmentName)
              .input('ModifiedOn', mssql.DateTime, new Date())
              .query(`
                  UPDATE Employees 
                  SET Department = @Department, ModifiedOn = @ModifiedOn 
                  WHERE EmployeeId = @EmployeeId
              `);
  
          if (result.rowsAffected[0] > 0) {
              res.status(200).send('Department updated successfully');
          } else {
              res.status(404).send('Employee not found');
          }
      } catch (err) {
          console.error('Error updating Department:', err.message);
          res.status(500).send('Internal Server Error');
      }
  });

  app.delete('/api/removedepartment/:id', async (req, res) => { 
    const { id } = req.params;
    
    try {
      const result = await pool.request()
        .input('EmployeeId', mssql.Int, id)
        .query(`
          UPDATE Employees
          SET Department = NULL
          WHERE EmployeeId = @EmployeeId
            AND Department IS NOT NULL
        `);

      if (result.rowsAffected[0] > 0) {
        res.status(200).send('User removed from department');
      } else {
        res.status(400).send('Employee not assigned to any department');
      }
    } catch (error) {
      console.error('Error removing user:', error.message);
      res.status(500).send('Internal Server Error');
    }
});


app.post('/api/createproject', async (req, res) => {
  const { projectName, description, dueDate, deptId, employeeId } = req.body;

  if (!projectName || !description || !dueDate || !deptId || !employeeId) {
      return res.status(400).json({
          error: 'All fields are required: ProjectName, Description, DueDate, DeptId, and EmployeeId.',
      });
  }

  const transaction = new mssql.Transaction();

  try {
      await transaction.begin();

      const insertProjectQuery = `
          INSERT INTO Project (ProjectName, Description, DueDate, DeptId)
          OUTPUT INSERTED.ProjectId
          VALUES (@ProjectName, @Description, @DueDate, @DeptId)
      `;
      const projectRequest = transaction.request();
      projectRequest.input('ProjectName', projectName);
      projectRequest.input('Description', description);
      projectRequest.input('DueDate', dueDate);
      projectRequest.input('DeptId', deptId);

      const projectResult = await projectRequest.query(insertProjectQuery);
      const projectId = projectResult.recordset[0].ProjectId;

      const insertTeamQuery = `
          INSERT INTO Team (ProjectId)
          OUTPUT INSERTED.TeamId
          VALUES (@ProjectId)
      `;
      const teamRequest = transaction.request();
      teamRequest.input('ProjectId', projectId);

      const teamResult = await teamRequest.query(insertTeamQuery);
      const teamId = teamResult.recordset[0].TeamId;

      const insertTeamMemberQuery = `
          INSERT INTO TeamMembers (EmployeeId, TeamId)
          VALUES (@EmployeeId, @TeamId)
      `;
      const teamMemberRequest = transaction.request();
      teamMemberRequest.input('EmployeeId', employeeId);
      teamMemberRequest.input('TeamId', teamId);

      await teamMemberRequest.query(insertTeamMemberQuery);

      await transaction.commit();

      res.status(201).json({
          message: 'Project, Team, and Team Member created successfully.',
          projectId,
          teamId,
      });
  } catch (err) {
      console.error('Error executing transaction:', err.message);
      await transaction.rollback();
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/createtask', async (req, res) => {
  const { taskName, description, dueDate, projectId } = req.body;


  if (!taskName || !description || !dueDate || !projectId) {
    return res.status(400).json({
      error: 'All fields are required: TaskName, Description, DueDate, and ProjectId.',
    });
  }

  const transaction = new mssql.Transaction();

  try {
    await transaction.begin();

    const insertTaskQuery = `
      INSERT INTO Task (TaskName, Description, DueDate, ProjectId)
      OUTPUT INSERTED.TaskId
      VALUES (@TaskName, @Description, @DueDate, @ProjectId)
    `;
    const taskRequest = transaction.request();
    taskRequest.input('TaskName', taskName);
    taskRequest.input('Description', description);
    taskRequest.input('DueDate', dueDate);
    taskRequest.input('ProjectId', projectId);

    const taskResult = await taskRequest.query(insertTaskQuery);
    const taskId = taskResult.recordset[0].TaskId;

    await transaction.commit();


    res.status(201).json({
      message: 'Task created successfully.',
      taskId,
    });
  } catch (err) {
    console.error('Error executing transaction:', err.message);
    await transaction.rollback();
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/subtasks', async (req, res) => {
  try {
    const result = await pool.request().query('SELECT * FROM SubTask');
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Error executing query:', err.message);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/api/createsubtask', async (req, res) => {
  const { subTaskName, taskId, dueDate, description } = req.body;

  if (!subTaskName || !taskId || !dueDate || !description) {
    return res.status(400).json({
      error: 'All fields are required: SubTaskName, TaskId, DueDate, and Description.',
    });
  }

  const transaction = new mssql.Transaction();

  try {
    
    await transaction.begin();

    const insertSubTaskQuery = `
      INSERT INTO SubTask (SubTaskName, TaskId, DueDate, Description)
      OUTPUT INSERTED.SubTaskId
      VALUES (@SubTaskName, @TaskId, @DueDate, @Description)
    `;

    const subTaskRequest = transaction.request();
    subTaskRequest.input('SubTaskName', subTaskName);
    subTaskRequest.input('TaskId', taskId);
    subTaskRequest.input('DueDate', dueDate);
    subTaskRequest.input('Description', description);

 
    const subTaskResult = await subTaskRequest.query(insertSubTaskQuery);
    const subTaskId = subTaskResult.recordset[0].SubTaskId;


    await transaction.commit();


    res.status(201).json({
      message: 'SubTask created successfully.',
      subTaskId,
    });
  } catch (err) {
    console.error('Error executing transaction:', err.message);

    await transaction.rollback();
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/updatetask', async (req, res) => {
  const { taskId, taskName, description, dueDate } = req.body;

  if (!taskId || !taskName || !description || !dueDate) {
    return res.status(400).json({
      error: 'All fields are required: TaskId, TaskName, Description, and DueDate.',
    });
  }

  const transaction = new mssql.Transaction();

  try {
    await transaction.begin();

    const updateTaskQuery = `
      UPDATE Task
      SET TaskName = @TaskName,
          Description = @Description,
          DueDate = @DueDate
      WHERE TaskId = @TaskId
    `;
    const taskRequest = transaction.request();
    taskRequest.input('TaskId', taskId);
    taskRequest.input('TaskName', taskName);
    taskRequest.input('Description', description);
    taskRequest.input('DueDate', dueDate);

    await taskRequest.query(updateTaskQuery);

    await transaction.commit();

    res.status(200).json({
      message: 'Task updated successfully.',
    });
  } catch (err) {
    console.error('Error executing transaction:', err.message);
    await transaction.rollback();
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/updatesubtask', async (req, res) => {
  const { subTaskId, subTaskName, description, dueDate } = req.body;


  if (!subTaskId || !subTaskName || !description || !dueDate) {
    return res.status(400).json({
      error: 'All fields are required: SubTaskId, SubTaskName, Description, and DueDate.',
    });
  }

  const transaction = new mssql.Transaction();

  try {

    await transaction.begin();

    const updateSubTaskQuery = `
      UPDATE SubTask
      SET SubTaskName = @SubTaskName,
          Description = @Description,
          DueDate = @DueDate
      WHERE SubTaskId = @SubTaskId
    `;
    const subTaskRequest = transaction.request();
    subTaskRequest.input('SubTaskId', subTaskId);
    subTaskRequest.input('SubTaskName', subTaskName);
    subTaskRequest.input('Description', description);
    subTaskRequest.input('DueDate', dueDate);

    await subTaskRequest.query(updateSubTaskQuery);

    await transaction.commit();

    res.status(200).json({
      message: 'SubTask updated successfully.',
    });
  } catch (err) {
    console.error('Error executing transaction:', err.message);

    await transaction.rollback();
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/updateproject', async (req, res) => {
  const { projectId, projectName, description, dueDate } = req.body;

  if (!projectId || !projectName || !description || !dueDate) {
    return res.status(400).json({
      error: 'All fields are required: ProjectId, ProjectName, Description, and DueDate.',
    });
  }

  const transaction = new mssql.Transaction();

  try {
    await transaction.begin();

    const updateProjectQuery = `
      UPDATE Project
      SET ProjectName = @ProjectName,
          Description = @Description,
          DueDate = @DueDate
      WHERE ProjectId = @ProjectId
    `;

    const projectRequest = transaction.request();
    projectRequest.input('ProjectId', projectId);
    projectRequest.input('ProjectName', projectName);
    projectRequest.input('Description', description);
    projectRequest.input('DueDate', dueDate);

    await projectRequest.query(updateProjectQuery);

    await transaction.commit();

    res.status(200).json({
      message: 'Project updated successfully.',
    });
  } catch (err) {
    console.error('Error executing transaction:', err.message);

    await transaction.rollback();
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.delete('/api/deletetask', async (req, res) => {
  const sql = require('mssql'); 
  const { taskId } = req.body;

  if (!taskId || typeof taskId !== 'number') {
    console.error("Invalid TaskId received:", taskId);
    return res.status(400).send("Task ID must be a valid number");
  }

  try {
    const result = await pool.request()
      .input('TaskId', sql.Int, taskId) 
      .query('DELETE FROM Task WHERE TaskId = @TaskId');

    if (result.rowsAffected[0] === 0) {
      console.warn("Task not found for TaskId:", taskId);
      return res.status(404).send("Task not found");
    }
    res.status(200).send("Task deleted successfully");
  } catch (err) {
    console.error("Error executing query:", err.message, err.stack);
    res.status(500).send("Internal Server Error");
  }
});

app.delete('/api/deletesubtask', async (req, res) => {
  const sql = require('mssql'); 
  const { subTaskId } = req.body;

  if (!subTaskId || typeof subTaskId !== 'number') {
    console.error("Invalid SubTaskId received:", subTaskId);
    return res.status(400).send("Subtask ID must be a valid number");
  }

  try {
    const result = await pool.request()
      .input('SubTaskId', sql.Int, subTaskId) 
      .query('DELETE FROM SubTask WHERE SubTaskId = @SubTaskId');

    if (result.rowsAffected[0] === 0) {
      console.warn("Subtask not found for SubTaskId:", subTaskId);
      return res.status(404).send("Subtask not found");
    }
    res.status(200).send("Subtask deleted successfully");
  } catch (err) {
    console.error("Error executing query:", err.message, err.stack);
    res.status(500).send("Internal Server Error");
  }
});


app.delete('/api/deleteproject', async (req, res) => {
  const sql = require('mssql'); 
  const { projectId } = req.body;

  if (!projectId || typeof projectId !== 'number') {
    console.error("Invalid ProjectId received:", projectId);
    return res.status(400).send("Project ID must be a valid number");
  }

  try {
    const result = await pool.request()
      .input('ProjectId', sql.Int, projectId) 
      .query('DELETE FROM Project WHERE ProjectId = @ProjectId');

    if (result.rowsAffected[0] === 0) {
      console.warn("Project not found for ProjectId:", projectId);
      return res.status(404).send("Project not found");
    }
    res.status(200).send("Project deleted successfully");
  } catch (err) {
    console.error("Error executing query:", err.message, err.stack);
    res.status(500).send("Internal Server Error");
  }
});







  }
}).catch(err => {
  console.error('Database connection failed:', err.message);
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
