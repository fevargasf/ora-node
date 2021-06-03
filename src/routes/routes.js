const { Router } = require("express");
const router = Router();
const oracledb = require("oracledb");
const { merge:mergePdf } = require('merge-pdf-buffers');


//1 /// //niSecTer secuencia tercero número de expediente

router.post("/api/test", async (req, res) => {
  const { sequenceFolder, sequenceThirdParty } = req.body;
  const mypw = "control1";
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: "autogestion",
      password: mypw,
      connectString:
        "(DESCRIPTION=(LOAD_BALANCE=on)(ADDRESS=(PROTOCOL=TCP)(HOST=scan-corant.corantioquia.local)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=bdpru)))",
    });

    //niSecTer secuencia tercero
    const plsql = await connection.execute(
      ` BEGIN  sirena.pks_autogestion_sgmto.consulta_expediente(:niSecExp, :voError,:cursor );END;`,
      {
        niSecExp: sequenceThirdParty,
        voError: "",
        cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      }
    );

    const resultCon = plsql.outBinds.cursor;
    let row;
    let rows = [];
    while ((row = await resultCon.getRow())) {
      console.log(row);
      console.log("filas " + row);
      rows.push(row);
      res.status(200).json(rows);
    }

    await resultCon.close();
  } catch (error) {
    console.log(error);
  }
});
//2//////////////////// niSecExp para obtener la resolución

router.post("/api/consulta", async (req, res) => {
  const { sequenceFolder, sequenceThirdParty } = req.body;
  const mypw = "control1";
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: "autogestion",
      password: mypw,
      connectString:
        "(DESCRIPTION=(LOAD_BALANCE=on)(ADDRESS=(PROTOCOL=TCP)(HOST=scan-corant.corantioquia.local)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=bdpru)))",
    });

    const plsqlEX = await connection.execute(
      ` BEGIN  sirena.pks_autogestion_sgmto.consulta_resoluciones(:niSecExp, :voError,:cursor );END;`,
      {
        niSecExp: sequenceThirdParty,
        voError: "",
        cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      }
    );

    const resultEX = plsqlEX.outBinds.cursor;
    let row;
    let rows = [];
    while ((row = await resultEX.getRow())) {
      console.log(rows);
      rows.push(row);
    }

    await resultEX.close();

    if (rows != undefined) {
      if (rows.length > 0) {
        res.status(200).json(rows);
      } else {
        res.status(200).json({});
      }
    } else {
      res.status(400).json({});
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/api/lista-expediente", async (req, res) => {
  const { sequenceThirdParty } = req.body;
  const mypw = "control1";
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: "autogestion",
      password: mypw,
      connectString:
        "(DESCRIPTION=(LOAD_BALANCE=on)(ADDRESS=(PROTOCOL=TCP)(HOST=scan-corant.corantioquia.local)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=bdpru)))",
    });

    const plsqlEX = await connection.execute(
      ` BEGIN  sirena.pks_autogestion_sgmto.lista_expedientes(:niSecTer, :voError,:cursor );END;`,
      {
        niSecTer: sequenceThirdParty,
        voError: "",
        cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      }
    );

    const resultEX = plsqlEX.outBinds.cursor;
    let row;
    let rows=[]
    while ((row = await resultEX.getRow())) {
      console.log(rows);
      rows.push(row);
    }
    await resultEX.close();

    if (rows != undefined) {
      if (rows.length > 0) {
        res.status(200).json(rows);
      } else {
        res.status(200).json({});
      }
    } else {
      res.status(400).json({});
    }
  } catch (error) {
    console.log(error);
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


router.post("/api/guardar-obligacion", async (req, res) => {
  const { expecter,sequenceThirdParty,line,viDes,test,secR } = req.body;
  const mypw = "control1";
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: "autogestion",
      password: mypw,
      connectString:
        "(DESCRIPTION=(LOAD_BALANCE=on)(ADDRESS=(PROTOCOL=TCP)(HOST=scan-corant.corantioquia.local)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=bdpru)))",
    });

    const plsqlEX = await connection.execute(
      ` BEGIN sirena.pks_autogestion_sgmto.guardar_obligacion(:niSecExp, :niSecTer, :nioLinea,:viDescripcion, :viObservacion,:niSecResol ,:voError );END;`,
      {
        niSecExp:expecter,
        niSecTer:sequenceThirdParty,
        nioLinea:line,
        viDescripcion:viDes,
        viObservacion:test,
        niSecResol:secR,
        voError:"",
      },{ autoCommit: true }
    );
    const resultEX = plsqlEX.outBinds
    res.json({msg:"obligación save"});
    res.status(200).json({});
   
   
  } catch (error) {
    console.log(error);
  }
});


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get("/api/consulta-obligacion", async (req, res) => {
  const { expecter, sequenceThirdParty } = req.body;
  const mypw = "control1";
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: "autogestion",
      password: mypw,
      connectString:
        "(DESCRIPTION=(LOAD_BALANCE=on)(ADDRESS=(PROTOCOL=TCP)(HOST=scan-corant.corantioquia.local)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=bdpru)))",
    });

    const plsqlEX = await connection.execute(
      ` BEGIN  sirena.pks_autogestion_sgmto.consulta_obligaciones(:niSecExp, :niSecTer, :voError, :cursor );END;`,
      {
        niSecExp:expecter,
        niSecTer: sequenceThirdParty,
        voError: "",
        cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      }
    );

    const resultEX = plsqlEX.outBinds.cursor;
    let row;
    let rows=[]
    while ((row = await resultEX.getRow())) {
      console.log(rows);
      rows.push(row);
    }
    await resultEX.close();
     console.log(rows)
    if (rows != undefined) {
      if (rows.length > 0) {
        res.status(200).json(rows);
      } else {
        res.status(200).json({});
      }
    } else {
      res.status(400).json({});
    }
  } catch (error) {
    console.log(error);
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post("/api/borrar_obligacion", async function(req, res, next) {
  const { expecter, sequenceThirdParty,line} = req.body;
  const mypw = "control1";
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: "autogestion",
      password: mypw,
      connectString:
        "(DESCRIPTION=(LOAD_BALANCE=on)(ADDRESS=(PROTOCOL=TCP)(HOST=scan-corant.corantioquia.local)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=bdpru)))",
    });
    const obliga_file = await connection.execute(
      ` BEGIN sirena.pks_autogestion_sgmto.borrar_obligacion(:niSecExp,:niSecTer,:niLinea,:voError );END;`,
      {
        niSecExp:expecter,
        niSecTer:sequenceThirdParty,
        niLinea:line,//niolinea
        voError:"",
      }
    );
   
    const resultfile = obliga_file.outBinds
    res.json({msg:"linea de obligacion eliminada"});
    res.status(200).json({});
  
  
  } catch (error) {
    console.log(error);
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post( "/api/borra_archivo",async function(req, res) {
  const { expecter, sequenceThirdParty} = req.body;
  const mypw = "control1";
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: "autogestion",
      password: mypw,
      connectString:
        "(DESCRIPTION=(LOAD_BALANCE=on)(ADDRESS=(PROTOCOL=TCP)(HOST=scan-corant.corantioquia.local)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=bdpru)))",
    });
    
    const obliga_delete = await connection.execute(
      ` BEGIN sirena.pks_autogestion_sgmto.borrar_archivo(:niSecExp,:niSecTer,:niLineaObligacion,:niNroArchivo, :voError);END;`,
      {
        niSecExp:expecter,
        niSecTer:sequenceThirdParty ,
        niLineaObligacion:2,
        niNroArchivo:1,
        voError:"",
      }
    ); 
    const resultDelet = obliga_delete.outBinds
    console.log("eliminado file")
    res.status(200).json({});

  } catch (error) {
    console.log(error);
  }
});

router.post("/api/guardar_archivo", async (req, res) => {
  console.log(req.files)
  let file = req.files.file
  const { expecter, sequenceThirdParty } = req.body;
  const mypw = "control1";
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: "autogestion",
      password: mypw,
      connectString:
        "(DESCRIPTION=(LOAD_BALANCE=on)(ADDRESS=(PROTOCOL=TCP)(HOST=scan-corant.corantioquia.local)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=bdpru)))",
    });

    
    const plsqlEX = await connection.execute(
      ` BEGIN  sirena.pks_autogestion_sgmto.guardar_archivo(
        niSecExp =>:niSecExp,
        niSecTer =>:niSecTer,
        niLineaObligacion =>:niLineaObligacion,
        viNombre =>:viNombre,
        bliArchivo =>:bliArchivo,
        noNroArchivo =>:noNroArchivo,
        voError =>:voError
      );END;`,
      {
        niSecExp:57552,
        niSecTer: 6129 ,
        niLineaObligacion:1,//niLinea de guardar obligación
        viNombre:file.name,
        bliArchivo:  { type: oracledb.BLOB, dir: oracledb.BIND_IN, val:file.data },
        noNroArchivo:"",
        voError: "",
      },{autoCommit:true}
    );

    const resultEX = plsqlEX.outBinds;
      console.log(resultEX)
      res.json({message:"nuevo adjunto"});
    res.status(200).json({});
      
    
  } catch (error) {
    console.log(error);
  }


});
///////////////////////////////////////////////////////////////////////////////////////
router.get("/api/consulta_obliga_archivos", async (req, res) => {
  const { expecter, sequenceThirdParty } = req.body;
  const mypw = "control1";
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: "autogestion",
      password: mypw,
      connectString:
        "(DESCRIPTION=(LOAD_BALANCE=on)(ADDRESS=(PROTOCOL=TCP)(HOST=scan-corant.corantioquia.local)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=bdpru)))",
    });

    const plsqlEX = await connection.execute(
      ` BEGIN  sirena.pks_autogestion_sgmto.consulta_obliga_archivos(:niSecExp, :niSecTer, :voError, :cursor );END;`,
      {
        niSecExp:57552,
        niSecTer:6129,
        voError:"",
      }
    );

    const resultEX = plsqlEX.outBinds.cursor;
    let row;
    let rows=[]
    while ((row = await resultEX.getRow())) {
      console.log(rows);
      rows.push(row);
    }
    await resultEX.close();
     console.log(rows)
    if (rows != undefined) {
      if (rows.length > 0) {
        res.status(200).json(rows);
      } else {
        res.status(200).json({});
      }
    } else {
      res.status(400).json({});
    }
  } catch (error) {
    console.log(error);
  }
});


router.get("/api/descargar-consolidado", async (req, res) => {
  const { expecter, sequenceThirdParty } = req.body;

  const mypw = "control1";
  let connection;
  oracledb.fetchAsBuffer = [oracledb.BLOB];
  try {
    connection = await oracledb.getConnection({
      user: "autogestion",
      password: mypw,
      connectString:
        "(DESCRIPTION=(LOAD_BALANCE=on)(ADDRESS=(PROTOCOL=TCP)(HOST=scan-corant.corantioquia.local)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=bdpru)))",
    });

    const plsqlEX = await connection.execute(
      ` BEGIN  sirena.pks_autogestion_sgmto.consulta_obliga_archivos(:niSecExp, :niSecTer, :voError, :cursor );END;`,
      {
        niSecExp:57552,
        niSecTer:6129,
        voError:"",
        cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      }
    );

    const resultEX = plsqlEX.outBinds.cursor;
    let row;
    let rows=[]
    while ((row = await resultEX.getRow())) {
      //console.log(rows[1]);
      rows.push(row);
    }
    await resultEX.close();
    // console.log(rows)
    if (rows != undefined) {
      if (rows.length > 0) {


        
        const file =rows[4][8];
       //res.download(file,'myfile')
  /*      const buffers = rows.map(row =>row[8])
       const buffersFiltered = buffers.filter(buffer=>buffer!=null)
       const pdf = await mergePdf(buffersFiltered); */
        const buffers=[]
        for (const row of rows) {
          let buffer = row[8];

          if(buffer!=null){
            let fileName = row[7];
            let fileType =fileName.split('.')[1]
           
            let file = {
              name:fileName,
              buffer:buffer,
              type:fileType //docx or pdf
            }
            if (fileType==='pdf'){
              buffers.push(file.buffer)
            }
            if (fileType==='docx'){
              // buscar una libreria que nos convierta en pdf docx una vez que se haga agregar al arreglo
              
            }


          }
         
            
          
        }
        const pdf = await mergePdf(buffers);

       res.setHeader('Content-Length', pdf.length);
        res.write(pdf, 'binary');
        res.end();

        // txt, pdf .doc, publicdoc, html, png  sql
       // console.log(rows[0][5])

      //res.status(200).json(rows);
      } else {
        res.status(200).json({});
      }
    } else {
      res.status(400).json({});
    }
  } catch (error) {
    console.log(error);
  }


})

module.exports = router;
