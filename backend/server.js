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



  }
}).catch(err => {
  console.error('Database connection failed:', err.message);
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
