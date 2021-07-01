//oracle PL/SQL

const oracledb = require("oracledb");
const mypw = "control1";

async function run() {
  return new Promise(async function () {
    let connection;

    try {
      connection = await oracledb.getConnection({
        user: "autogestion",
        password: mypw,
        connectString:
          "(DESCRIPTION=(LOAD_BALANCE=on)(ADDRESS=(PROTOCOL=TCP)(HOST=scan-corant.corantioquia.local)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=bdpru)))",
      });
////////////////////////////////////////////////LISTA EXPEDIENTES////////////////////////////////////////////////////////////////////////////


      const result = await connection.execute(
        `BEGIN  sirena.pks_autogestion_sgmto.lista_expedientes(:niSecTer, :voError,:cursor );END;`,
        {
          niSecTer: 6129,
          voError: "",
          cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
        }
      );

      const resultSet = result.outBinds.cursor;
      let row;
      while ((row = await resultSet.getRow())) {
       // console.log(row);
    
      }

      await resultSet.close();
///////////////////////////CONSULTA EXPEDIENTE/////////////////////////////////////////////

        // niSec secuencia expendiente
      const plsql = await connection.execute(
        ` BEGIN  sirena.pks_autogestion_sgmto.consulta_expediente(:niSecExp, :voError,:cursor );END;`,
        {
          niSecExp: 101522,
          voError: "",
          cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
        }
      );

      const resultCon = plsql.outBinds.cursor;
      let rows;
      while ((rows = await resultCon.getRow())) {
  
      }
      
      await resultCon.close();
  
    } catch (err) {
      // catches errors in getConnection and the query
      //console.error(err);
    } finally {
      if (connection) {
        // the connection assignment worked, must release
        try {
          await connection.close();
        } catch (e) {
          //console.error(e);
        }
      }


      
    }
    
  });

  
  
    
 
}

run();
