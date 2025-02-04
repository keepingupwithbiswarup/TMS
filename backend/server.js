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
  server: '125.22.105.182',
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
    app.get('/api/departmentpopulation', async (req, res) => {
      try {
        const result = await pool.request().query('select Department ,COUNT(*) as Population from Employees Group by Department');
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
      const { projectName, description, dueDate, deptId, employeeIds } = req.body;

      if (!projectName || !description || !dueDate || !deptId || !Array.isArray(employeeIds) || employeeIds.length === 0) {
        return res.status(400).json({
          error: 'All fields are required: ProjectName, Description, DueDate, DeptId, and at least one EmployeeId.',
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
        for (const employeeId of employeeIds) {
          const teamMemberRequest = transaction.request();
          teamMemberRequest.input('EmployeeId', employeeId);
          teamMemberRequest.input('TeamId', teamId);
          await teamMemberRequest.query(insertTeamMemberQuery);
        }

        await transaction.commit();

        res.status(201).json({
          message: 'Project, Team, and Team Members created successfully.',
          projectId,
          teamId,
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


    app.post('/api/createtask', async (req, res) => {
      const { taskName, projectId, dueDate, description } = req.body;

      if (!taskName || !projectId || !dueDate || !description) {
        return res.status(400).json({
          error: 'All fields are required: taskName, projectId, dueDate, and description.',
        });
      }

      const transaction = new mssql.Transaction();

      try {
        await transaction.begin();

        const insertTaskQuery = `
          INSERT INTO Task (TaskName, ProjectId, DueDate, Description)
          OUTPUT INSERTED.TaskId
          VALUES (@TaskName, @ProjectId, @DueDate, @Description)
        `;

        const taskRequest = transaction.request();
        taskRequest.input('TaskName', mssql.VarChar, taskName);
        taskRequest.input('ProjectId', mssql.Int, projectId);
        taskRequest.input('DueDate', mssql.DateTime, dueDate);
        taskRequest.input('Description', mssql.VarChar, description);

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
    app.delete('/api/deleteteammembers', async (req, res) => {
      const sql = require('mssql');
      const { projectId, employeeIds } = req.body;

      if (!projectId || !Array.isArray(employeeIds) || employeeIds.length === 0) {
        console.error("Invalid inputs received:", { projectId, employeeIds });
        return res.status(400).send("ProjectId and EmployeeIds must be valid");
      }

      try {
        for (let employeeId of employeeIds) {
          const result = await pool.request()
            .input('EmployeeId', sql.Int, employeeId)
            .input('ProjectId', sql.Int, projectId)
            .query(`
          DELETE FROM TeamMembers 
          WHERE EmployeeId = @EmployeeId 
          AND TeamId = (SELECT TeamId FROM Team WHERE ProjectId = @ProjectId)
        `);

          if (result.rowsAffected[0] === 0) {
            console.warn("No TeamMember found for EmployeeId:", employeeId, "in ProjectId:", projectId);
            continue;
          }
        }

        res.status(200).send("Team Members removed successfully");
      } catch (err) {
        console.error("Error executing query:", err.message, err.stack);
        res.status(500).send("Internal Server Error");
      }
    });

    app.get('/api/timesheetdata', async (req, res) => {
      try {
        const result = await pool.request().query(`SELECT DISTINCT 
    tser.TimesheetEmpId,
    tser.EmployeeId,
    emp.Username,
    tser.ProjectId,
    proj.ProjectName,
    proj.DeptId,
    ts.TimesheetId,
    ts.DateInfo,
    ts.StartTime,
    ts.EndTime,
    ts.Description,
    ts.Status,
    ts.SubTaskId,
    sub.SubTaskName,
    sub.TaskId,
    task.TaskName
FROM 
    TimesheetEmpRel tser
JOIN 
    Timesheet ts ON tser.TimesheetId = ts.TimesheetId
JOIN 
    SubTask sub ON ts.SubTaskId = sub.SubTaskId
JOIN 
    Task task ON sub.TaskId = task.TaskId
JOIN 
    Project proj ON tser.ProjectId = proj.ProjectId
JOIN 
    Employees emp ON tser.EmployeeId = emp.EmployeeId;`);
        res.status(200).json(result.recordset);
      } catch (err) {
        console.error('Error executing query:', err.message);
        res.status(500).send('Internal Server Error');
      }
    });


    app.post('/api/createtimesheet', async (req, res) => {
      const { subTaskId, startTime, endTime, description, status, dateInfo, employeeId, projectId } = req.body;

      if (!subTaskId || !startTime || !endTime || !description || !status || !dateInfo || !employeeId || !projectId) {
        return res.status(400).json({
          error: 'All fields are required: SubTaskId, StartTime, EndTime, Description, Status, DateInfo, EmployeeId, and ProjectId.',
        });
      }

      const transaction = new mssql.Transaction();

      try {
        await transaction.begin();

        const insertTimesheetQuery = `
          INSERT INTO Timesheet (SubTaskId, StartTime, EndTime, Description, Status, DateInfo)
          OUTPUT INSERTED.TimesheetId
          VALUES (@SubTaskId, @StartTime, @EndTime, @Description, @Status, @DateInfo)
        `;

        const timesheetRequest = transaction.request();
        timesheetRequest.input('SubTaskId', mssql.Int, subTaskId);
        timesheetRequest.input('StartTime', mssql.DateTime, startTime);
        timesheetRequest.input('EndTime', mssql.DateTime, endTime);
        timesheetRequest.input('Description', mssql.NVarChar(200), description);
        timesheetRequest.input('Status', mssql.NVarChar(100), status);
        timesheetRequest.input('DateInfo', mssql.Date, dateInfo);

        const timesheetResult = await timesheetRequest.query(insertTimesheetQuery);
        const timesheetId = timesheetResult.recordset[0].TimesheetId;

        const insertTimesheetEmpRelQuery = `
          INSERT INTO TimesheetEmpRel (EmployeeId, ProjectId, TimesheetId)
          VALUES (@EmployeeId, @ProjectId, @TimesheetId)
        `;

        const timesheetEmpRelRequest = transaction.request();
        timesheetEmpRelRequest.input('EmployeeId', mssql.Int, employeeId);
        timesheetEmpRelRequest.input('ProjectId', mssql.Int, projectId);
        timesheetEmpRelRequest.input('TimesheetId', mssql.Int, timesheetId);

        await timesheetEmpRelRequest.query(insertTimesheetEmpRelQuery);

        await transaction.commit();

        res.status(201).json({
          message: 'Timesheet and TimesheetEmpRel created successfully.',
          timesheetId,
        });
      } catch (err) {
        console.error('Error executing transaction:', err.message);

        await transaction.rollback();

        res.status(500).json({ error: 'Internal Server Error' });
      }
    });


    app.delete('/api/deletetimesheet', async (req, res) => {
      const sql = require('mssql');
      const { timesheetId } = req.body;

      if (!timesheetId || typeof timesheetId !== 'number') {
        console.error("Invalid TimesheetId received:", timesheetId);
        return res.status(400).send("Timesheet ID must be a valid number");
      }

      try {
        const result = await pool.request()
          .input('TimesheetId', sql.Int, timesheetId)
          .query('DELETE FROM Timesheet WHERE TimesheetId = @TimesheetId');

        if (result.rowsAffected[0] === 0) {
          console.warn("Timesheet not found for TimesheetId:", timesheetId);
          return res.status(404).send("Timesheet not found");
        }

        res.status(200).send("Timesheet deleted successfully");
      } catch (err) {
        console.error("Error executing query:", err.message, err.stack);
        res.status(500).send("Internal Server Error");
      }
    });


    app.put('/api/updatetimesheet', async (req, res) => {
      const {
        timesheetId,
        subTaskId,
        startTime,
        endTime,
        description,
        status,
        dateInfo,
        employeeId,
        projectId,
      } = req.body;

      if (
        !timesheetId ||
        !subTaskId ||
        !startTime ||
        !endTime ||
        !description ||
        !status ||
        !dateInfo ||
        !employeeId ||
        !projectId
      ) {
        return res.status(400).json({
          error: 'All fields are required: TimesheetId, SubTaskId, StartTime, EndTime, Description, Status, DateInfo, EmployeeId, and ProjectId.',
        });
      }

      const transaction = new mssql.Transaction();

      try {
        await transaction.begin();

        const updateTimesheetQuery = `
          UPDATE Timesheet
          SET
            SubTaskId = @SubTaskId,
            StartTime = @StartTime,
            EndTime = @EndTime,
            Description = @Description,
            Status = @Status,
            DateInfo = @DateInfo
          WHERE TimesheetId = @TimesheetId
        `;

        const timesheetRequest = transaction.request();
        timesheetRequest.input('TimesheetId', mssql.Int, timesheetId);
        timesheetRequest.input('SubTaskId', mssql.Int, subTaskId);
        timesheetRequest.input('StartTime', mssql.DateTime, startTime);
        timesheetRequest.input('EndTime', mssql.DateTime, endTime);
        timesheetRequest.input('Description', mssql.NVarChar(200), description);
        timesheetRequest.input('Status', mssql.NVarChar(100), status);
        timesheetRequest.input('DateInfo', mssql.Date, dateInfo);

        const timesheetResult = await timesheetRequest.query(updateTimesheetQuery);

        if (timesheetResult.rowsAffected[0] === 0) {
          throw new Error('Timesheet not found.');
        }

        const updateTimesheetEmpRelQuery = `
          UPDATE TimesheetEmpRel
          SET
            EmployeeId = @EmployeeId,
            ProjectId = @ProjectId
          WHERE TimesheetId = @TimesheetId
        `;

        const timesheetEmpRelRequest = transaction.request();
        timesheetEmpRelRequest.input('EmployeeId', mssql.Int, employeeId);
        timesheetEmpRelRequest.input('ProjectId', mssql.Int, projectId);
        timesheetEmpRelRequest.input('TimesheetId', mssql.Int, timesheetId);

        const timesheetEmpRelResult = await timesheetEmpRelRequest.query(updateTimesheetEmpRelQuery);

        if (timesheetEmpRelResult.rowsAffected[0] === 0) {
          throw new Error('TimesheetEmpRel not found.');
        }

        await transaction.commit();

        res.status(200).json({
          message: 'Timesheet and TimesheetEmpRel updated successfully.',
        });
      } catch (err) {
        console.error('Error executing transaction:', err.message);

        await transaction.rollback();

        res.status(500).json({ error: 'Internal Server Error' });
      }
    });


    app.post('/api/addteammembers', async (req, res) => {
      const sql = require('mssql');
      const { teamId, employeeIds } = req.body;

      if (!teamId || !Array.isArray(employeeIds) || employeeIds.length === 0) {
        console.error("Invalid inputs received:", { teamId, employeeIds });
        return res.status(400).send("TeamId and EmployeeIds must be valid");
      }

      try {
        for (let employeeId of employeeIds) {
          const result = await pool.request()
            .input('EmployeeId', sql.Int, employeeId)
            .input('TeamId', sql.Int, teamId)
            .query(`
              INSERT INTO TeamMembers (EmployeeId, TeamId) 
              VALUES (@EmployeeId, @TeamId)
            `);

          if (result.rowsAffected[0] === 0) {
            console.warn("Failed to add TeamMember for EmployeeId:", employeeId, "to TeamId:", teamId);
          }
        }

        res.status(201).send("Team Members added successfully");
      } catch (err) {
        console.error("Error executing query:", err.message, err.stack);
        res.status(500).send("Internal Server Error");
      }
    });

    app.post('/api/calendar', async (req, res) => {
      const { deptId } = req.body;

      if (!deptId) {
        return res.status(400).send('Department ID is required');
      }

      try {
        const result = await pool.request()
          .input('DeptId', deptId)
          .query(`
            SELECT ST.*, P.ProjectName
FROM SubTask ST
JOIN Task T ON ST.TaskId = T.TaskId
JOIN Project P ON T.ProjectId = P.ProjectId
WHERE P.DeptId = @DeptId AND (ST.Status = 'Due' OR ST.Status = 'Ongoing');
          `);

        res.status(200).json(result.recordset);
      } catch (err) {
        console.error('Error executing query:', err.message);
        res.status(500).send('Internal Server Error');
      }
    });



    app.post('/api/workinghours', async (req, res) => {
      const { department } = req.body;

      if (!department) {
        return res.status(400).json({ error: 'Department name is required.' });
      }

      try {
        const result = await pool
          .request()
          .input('Department', mssql.NVarChar(200), department)
          .query(`
            SELECT 
                e.EmployeeId,
                e.Username AS EmployeeName,
                t.DateInfo,
                COALESCE(t.StartTime, '00:00:00') AS StartTime,
                COALESCE(t.EndTime, '00:00:00') AS EndTime
            FROM 
                Employees e
            LEFT JOIN 
                TimesheetEmpRel ter ON e.EmployeeId = ter.EmployeeId
            LEFT JOIN 
                Timesheet t ON ter.TimesheetId = t.TimesheetId
            WHERE 
                e.Department = @Department
            ORDER BY 
                e.EmployeeId, t.StartTime;
          `);

        res.status(200).json(result.recordset);
      } catch (err) {
        console.error('Error executing query:', err.message);
        res.status(500).send('Internal Server Error');
      }
    });

    app.put('/api/approvesubtask/:id', async (req, res) => {
      const { id } = req.params;
      const { status, approval, timesheetId } = req.body;

      const subtaskStatus = status || 'Finished';
      const subtaskApproval = approval || 'Approved';

      try {
        const transaction = new mssql.Transaction(pool);
        await transaction.begin();

        const request = new mssql.Request(transaction);

        const subtaskResult = await request
          .input('SubTaskId', mssql.Int, id)
          .input('Status', mssql.NVarChar, subtaskStatus)
          .input('Approval', mssql.NVarChar, subtaskApproval)
          .query(`
                  UPDATE SubTask
                  SET Status = @Status, Approval = @Approval
                  WHERE SubTaskId = @SubTaskId
              `);

        if (subtaskResult.rowsAffected[0] === 0) {
          await transaction.rollback();
          return res.status(404).send('SubTask not found');
        }

        const timesheetResult = await request
          .input('TimesheetId', mssql.Int, timesheetId)
          .input('TStatus', mssql.NVarChar, subtaskApproval)
          .query(`
                  UPDATE Timesheet
                  SET Status = @TStatus
                  WHERE TimesheetId = @TimesheetId
              `);

        if (timesheetResult.rowsAffected[0] === 0) {
          await transaction.rollback();
          return res.status(404).send('Timesheet not found');
        }

        await transaction.commit();
        res.status(200).send('SubTask and Timesheet status updated successfully');

      } catch (err) {
        console.error('Error updating SubTask or Timesheet status:', err.message);
        res.status(500).send('Internal Server Error');
      }
    });

    app.put('/api/taskstatus/:id', async (req, res) => {
      const { id } = req.params;
      const { status } = req.body;

      const taskStatus = status || 'Finished';


      try {
        const result = await pool.request()
          .input('TaskId', mssql.Int, id)
          .input('Status', mssql.NVarChar, taskStatus)
          .query(`
            UPDATE Task
            SET Status = @Status
            WHERE TaskId = @TaskId
          `);

        if (result.rowsAffected[0] > 0) {
          res.status(200).send('Task status updated successfully');

        } else {
          res.status(404).send('Task not found');
        }
      } catch (err) {
        console.error('Error updating Task status:', err.message);
        res.status(500).send('Internal Server Error');
      }
    });

    app.get('/api/subtaskstatuses/:projectId', async (req, res) => {
      const { projectId } = req.params;

      if (!projectId) {
        return res.status(400).json({
          error: 'ProjectId is required in the request parameters.',
        });
      }

      try {
        const pool = await mssql.connect(dbConfig);

        const query = `
          SELECT 
            SubTask.SubTaskId, 
            SubTask.SubTaskName, 
            SubTask.Status, 
            Project.ProjectId
          FROM 
            SubTask
          INNER JOIN 
            Task ON SubTask.TaskId = Task.TaskId
          INNER JOIN 
            Project ON Task.ProjectId = Project.ProjectId
          WHERE 
            Project.ProjectId = @ProjectId
        `;

        const request = pool.request();
        request.input('ProjectId', mssql.Int, projectId);

        const result = await request.query(query);

        res.status(200).json({
          message: `Subtasks for ProjectId ${projectId}`,
          subtasks: result.recordset,
        });
      } catch (err) {
        console.error('Error fetching subtasks:', err.message);

        res.status(500).json({
          error: 'An error occurred while fetching subtasks. Please try again later.',
        });
      }
    });

    app.put('/api/projectstatusupdate/:id', async (req, res) => {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).send('Status is required');
      }

      try {
        const result = await pool.request()
          .input('ProjectId', mssql.Int, id)
          .input('Status', mssql.NVarChar, status)
          .query(`
                  UPDATE Project
                  SET Status = @Status
                  WHERE ProjectId = @ProjectId
              `);

        if (result.rowsAffected[0] > 0) {
          res.status(200).send('Project status updated successfully');
        } else {
          res.status(404).send('Project not found');
        }
      } catch (err) {
        console.error('Error updating Project status:', err.message);
        res.status(500).send('Internal Server Error');
      }
    });

    app.get('/api/trackedhours', async (req, res) => {
      try {
        const result = await pool.request().query(`SELECT
    e.Department,
    COALESCE(SUM(DATEDIFF(MINUTE, t.StartTime, t.EndTime) / 60.0), 0) AS TotalWorkingHours
FROM Employees e
LEFT JOIN TimesheetEmpRel ter ON e.EmployeeId = ter.EmployeeId
LEFT JOIN Timesheet t ON ter.TimesheetId = t.TimesheetId
where e.Department is not null
GROUP BY e.Department
ORDER BY TotalWorkingHours DESC;`);
        res.status(200).json(result.recordset);
      } catch (err) {
        console.error('Error executing query:', err.message);
        res.status(500).send('Internal Server Error');
      }
    });
    app.get('/api/deptprojectcount', async (req, res) => {
      try {
        const result = await pool.request().query(`select DeptName,Count(*) as ProjectCount from Project left join Departments on Project.DeptId = Departments.DeptId group by DeptName;`);
        res.status(200).json(result.recordset);
      } catch (err) {
        console.error('Error executing query:', err.message);
        res.status(500).send('Internal Server Error');
      }
    });


    app.post('/api/projecttimesheets', async (req, res) => {
      const { projectId } = req.body;

      if (!projectId) {
        return res.status(400).send('Project ID is required');
      }

      try {
        const result = await pool.request()
          .input('ProjectId', projectId)
          .query(`
            SELECT 
              Timesheet.TimesheetId, 
              Timesheet.StartTime,
              Timesheet.EndTime,
              Timesheet.DateInfo, 
              Timesheet.Description, 
              SubTask.SubTaskId, 
              SubTask.SubTaskName, 
              Task.TaskId, 
              Task.TaskName, 
              Project.ProjectId, 
              Project.ProjectName
            FROM 
              Timesheet
            INNER JOIN 
              SubTask ON Timesheet.SubTaskId = SubTask.SubTaskId
            INNER JOIN 
              Task ON SubTask.TaskId = Task.TaskId
            INNER JOIN 
              Project ON Task.ProjectId = Project.ProjectId
            WHERE 
              Project.ProjectId = @ProjectId
            ORDER BY 
              Timesheet.DateInfo;
          `);
        res.status(200).json(result.recordset);
      } catch (err) {
        console.error('Error executing query:', err.message);
        res.status(500).send('Internal Server Error');
      }
    });


    app.get('/api/utimesheetcount', async (req, res) => {
      try {
        const result = await pool.request().query(`
              SELECT 
    SUM(CASE WHEN Status = 'Approved' THEN 1 ELSE 0 END) AS Approved,
    SUM(CASE WHEN Status = 'Unapproved' THEN 1 ELSE 0 END) AS Unapproved
FROM Timesheet;
          `);

        res.status(200).json(result.recordset[0]);
      } catch (err) {
        console.error('Error executing query:', err.message);
        res.status(500).send('Internal Server Error');
      }
    });

    app.get('/api/employeeworkinghrs/:employeeId', async (req, res) => {
      const { employeeId } = req.params;
    
      try {
        const result = await pool.request()
          .input('EmployeeId', mssql.Int, employeeId)
          .query(`
            SELECT 
    Employees.Username,
    SUM(DATEDIFF(MINUTE, Timesheet.StartTime, Timesheet.EndTime)) / 60.0 AS TotalWorkingHours
FROM Timesheet
JOIN TimesheetEmpRel ON Timesheet.TimesheetId = TimesheetEmpRel.TimesheetId
JOIN Employees ON TimesheetEmpRel.EmployeeId = Employees.EmployeeId
WHERE Employees.EmployeeId = @EmployeeId
GROUP BY Employees.Username
          `);
    
        if (result.recordset.length > 0) {
          res.status(200).json(result.recordset); 
        } 
        if (result.recordset.length === 0) {
          return res.status(404).json({ message: 'No timesheet data found for this employee.' });
        }
      } catch (err) {
        console.error('Error fetching timesheet data:', err.message);
        res.status(500).send('Internal Server Error');
      }
    });
    app.get('/api/employeetotalprojects/:employeeId', async (req, res) => {
      const { employeeId } = req.params;
      
      try {
        const result = await pool.request()
          .input('EmployeeId', mssql.Int, employeeId)
          .query(`
           
 SELECT 
          p.ProjectName,p.Status
        FROM TeamMembers tm
        JOIN Team t ON tm.TeamId = t.TeamId
        JOIN Project p ON t.ProjectId = p.ProjectId
        WHERE tm.EmployeeId = @EmployeeId
      
          `);
        
        if (result.recordset.length > 0) {
          return res.status(200).json(result.recordset); 
        }
        
        return res.status(404).json({ message: 'No Projects Assigned' });
    
      } catch (err) {
        console.error('Error fetching employee project data:', err.message);
        return res.status(500).send('Internal Server Error');
      }
    });
    app.get('/api/employeetimesheetcountbydate/:employeeId', async (req, res) => {
      const { employeeId } = req.params;
      
      try {
        const result = await pool.request()
          .input('EmployeeId', mssql.Int, employeeId)
          .query(`
           
 SELECT 
    CONVERT(DATE, t.DateInfo) AS Date, 
    COUNT(t.TimesheetId) AS TimesheetCount
FROM Timesheet t
JOIN TimesheetEmpRel ter ON t.TimesheetId = ter.TimesheetId
WHERE ter.EmployeeId = @EmployeeId
AND t.DateInfo >= DATEADD(DAY, -7, GETDATE())
GROUP BY CONVERT(DATE, t.DateInfo)
ORDER BY Date DESC
      
          `);
        
        if (result.recordset.length > 0) {
          return res.status(200).json(result.recordset); 
        }
        
        return res.status(404).json({ message: 'No Timesheets Found' });
    
      } catch (err) {
        console.error('Error fetching employee timesheets:', err.message);
        return res.status(500).send('Internal Server Error');
      }
    });


    app.put('/api/approvetimesheetsubtask', async (req, res) => {
      const { timesheetId, status } = req.body;
    
      if (!timesheetId || !status) {
        return res.status(400).send('TimesheetId and status are required');
      }
    
      try {
        const result = await pool.request()
          .input('TimesheetId', mssql.Int, timesheetId)
          .input('Status', mssql.NVarChar, status)
          .query(`
            UPDATE Timesheet
            SET Status = @Status
            WHERE TimesheetId = @TimesheetId
          `);
    
        if (result.rowsAffected[0] > 0) {
          res.status(200).send('Timesheet status updated successfully');
        } else {
          res.status(404).send('Timesheet not found');
        }
      } catch (err) {
        console.error('Error updating timesheet status:', err.message);
        res.status(500).send('Internal Server Error');
      }
    });
    
    
    





















  }
}).catch(err => {
  console.error('Database connection failed:', err.message);
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
