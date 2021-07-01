const { Router } = require("express");
const router = Router();
const oracledb = require("oracledb");
const { merge: mergePdf } = require("merge-pdf-buffers");

var CloudmersiveConvertApiClient = require("cloudmersive-convert-api-client");
var defaultClient = CloudmersiveConvertApiClient.ApiClient.instance;
var Apikey = defaultClient.authentications["Apikey"];
Apikey.apiKey = "ddb9588d-2848-4b48-9a17-35ec436421e8";
var apiInstance = new CloudmersiveConvertApiClient.ConvertDocumentApi();


const generateCover = require('../utils/generate-cover')
//2//////////////////// niSecExp para obtener la resolución

router.post("/api/v1/autogestion/consulta_resoluciones", async (req, res) => {
  const { expecter } = req.body;
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
        niSecExp: expecter,
        voError: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
        cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      }
    );

    const resultEX = plsqlEX.outBinds.cursor;
    let row;
    let rows = [];
    while ((row = await resultEX.getRow())) {
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
      res.status(400).json({ msn: resultEX.voError });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/api/v1/autogestion/expediente-lista", async (req, res) => {
  const { sequence } = req.body;
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
        niSecTer: sequence,
        voError: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
        cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      }
    );

    const resultEX = plsqlEX.outBinds.cursor;
    let row;
    let rows = [];
    while ((row = await resultEX.getRow())) {
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

router.post("/api/v1/autogestion/guardar-obligacion", async (req, res) => {
  const { expecter, sequence, nline, desc, obser, secR } = req.body;
  const mypw = "control1";
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: "autogestion",
      password: mypw,
      connectString:
        "(DESCRIPTION=(LOAD_BALANCE=on)(ADDRESS=(PROTOCOL=TCP)(HOST=scan-corant.corantioquia.local)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=bdpru)))",
    });

    const plsqlEX2 = await connection.execute(
      ` BEGIN sirena.pks_autogestion_sgmto.guardar_obligacion(:niSecExp, :niSecTer,:niSecResol, :nioLinea,:viDescripcion, :viObservacion,:voError);END;`,
      {
        niSecExp: expecter,
        niSecTer: sequence,
        niSecResol: secR, //resolucion para la que se realaciona archivo cargado
        nioLinea: nline,
        viDescripcion: desc,
        viObservacion: obser,
        voError: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
      }
    );
    const resultEX = plsqlEX2.outBinds;
    if (resultEX.voError === null) {
      await connection.commit();
    } else {
      await connection.rollback();
    }

    res.status(200).json({ MSN: resultEX.nline });
    console.log(resultEX.nioLinea);
  } catch (error) {
    console.log(error);
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get("/api/v1/autogestion/consulta-obligacion", async (req, res) => {
  const { expecter, sequence } = req.body;
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
        niSecExp: expecter,
        niSecTer: sequence,
        voError: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
        cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      }
    );

    const resultEX = plsqlEX.outBinds.cursor;
    let row;
    let rows = [];
    while ((row = await resultEX.getRow())) {
      console.log(resultEX.voError);
      rows.push(row);
    }
    await resultEX.close();
    console.log(rows);
    if (rows != undefined) {
      if (rows.length > 0) {
        res.status(200).json(rows);
      } else {
        res.status(200).json({});
      }
    } else {
      res.status(400).json({ msn: resultEX.voError });
      console.log(row[19]);
    }
  } catch (error) {
    console.log(error);
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post(
  "/api/v1/autogestion/borrar_obligacion",
  async function (req, res, next) {
    const { expecter, sequence, nline } = req.body;
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
          niSecExp: expecter,
          niSecTer: sequence,
          niLinea: nline, //niolinea
          voError: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
        }
      );

      const resultfile = obliga_file.outBinds;
      res.status(200).json({ msg: resultfile.voError });
    } catch (error) {
      console.log(error);
    }
  }
);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post("/api/v1/autogestion/borra_archivo", async function (req, res) {
  const { expecter, sequence, nline, numeb } = req.body;
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
        niSecExp: expecter,
        niSecTer: sequence,
        niLineaObligacion: nline, //numero niolinea guardar obligación
        niNroArchivo: numeb, //numeración del archivo
        voError: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
      }
    );
    const resultDelet = obliga_delete.outBinds;
    console.log("eliminado file");
    res.status(200).json({ msn: resultDelet.voError });
  } catch (error) {
    console.log(error);
  }
});

router.post("/api/v1/autogestion/guardar_archivo", async (req, res) => {
  console.log(req.files);
  let file = req.files.file;
  const { expecter, sequence, nline, nm } = req.body;
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
        niSecExp: expecter,
        niSecTer: sequence,
        niLineaObligacion: nline, //niLinea de guardar obligación
        viNombre: file.name,
        bliArchivo: {
          type: oracledb.BLOB,
          dir: oracledb.BIND_IN,
          val: file.data,
        },
        noNroArchivo: nm, //
        voError: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
      }
    );

    const resultEX = plsqlEX.outBinds;

    if (resultEX.voError === null) {
      await connection.commit();
    } else {
      await connection.rollback();
    }
    res.status(200).json({ resultEX });
  } catch (error) {
    console.log(error);
    console.log(resultEX.voError);
  }
});
///////////////////////////////////////////////////////////////////////////////////////
router.get("/api/v1/autogestion/consulta_obliga_archivos", async (req, res) => {
  const { expecter, sequence } = req.body;
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
        niSecExp: expecter,
        niSecTer: sequence,
        voError: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
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
    console.log(rows);
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

router.get("/api/v1/autogestion/descargar-consolidado", async (req, res) => {
  const { expecter, sequence } = req.query;

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
        niSecExp: expecter,
        niSecTer: sequence,
        voError: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
        cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      }
    );

    const resultEX = plsqlEX.outBinds.cursor;
    let row;
    let rows = [];
    while ((row = await resultEX.getRow())) {
      rows.push(row);
    }

    await resultEX.close();

    if (rows != undefined) {
      if (rows.length > 0) {
        const buffers = [];

 
        //  --------------------------- pdf informacion estatica
        let consolidado;
        for (const row of rows) {
          let buffer = row[9];

          //  -------------------------- anexos
  
            //consolidado.push(arma[i][8])
            //console.log(consolidado[0]);
    

          if (buffer != null) {
            //console.log('row',row)
            let fileName = row[8];

            //console.log('fileName',fileName)
            let fileType = fileName.split(".")[1];
            let file = {
              name: fileName,
              buffer: buffer,
              type: fileType,
            };
            //console.log("file", file.name);
            if (fileType === "pdf") {
              buffers.push(file.buffer);
            } /*  else {
              const data = await apiInstance.convertDocumentAutodetectToPdf(
                file.buffer
              );
              buffers.push(data.body);
            }  */
          }
        }


          const portada = generateCover(rows)
        //let portada=doc.save('test.pdf');
        let portadaPdf = portada.output("arraybuffer");
        //console.log("portada",portada)
        const bufferPortada = new Int8Array(portadaPdf);
        buffers.unshift(bufferPortada);

        const pdf = await mergePdf(buffers);

        res.setHeader("Content-Length", pdf.length);
        res.write(pdf, "binary");
        res.end();
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
//////////////////////////////////////////////////////////////////////////////
router.post("/api/v1/autogestion/terminar", async (req, res) => {
  const { expecter, sequence, rac, str, fijo, cel } = req.body;
  const mypw = "control1";
  oracledb.fetchAsBuffer = [oracledb.BLOB];
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: "autogestion",
      password: mypw,
      connectString:
        "(DESCRIPTION=(LOAD_BALANCE=on)(ADDRESS=(PROTOCOL=TCP)(HOST=scan-corant.corantioquia.local)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=bdpru)))",
    });

    const EX = await connection.execute(
      ` BEGIN sirena.pks_autogestion_sgmto.terminar(
        niSecExpe        => :niSecExp,
        niSecTer         => :niSecTer,
        viNomResponsable => :viNomResponsable,
        viCorreoRespo    => :viCorreoRespo,
        viTelRespoFijo   => :viTelRespoFijo,
        viTelRespoCelu   => :viTelRespoCelu,
        noSecDocCoe      => :noSecDocCoe,
        voRadicadoCoe    => :voRadicadoCoe,
        doRadicado       => :doRadicado,
        voRutaCoe        => :voRutaCoe,
        voError          => :voError);END;`,
      {
        niSecExp: expecter,
        niSecTer: sequence,
        viNomResponsable: rac,
        viCorreoRespo: str,
        viTelRespoFijo: fijo,
        viTelRespoCelu: cel,
        noSecDocCoe: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
        voRadicadoCoe: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
        doRadicado: { type: oracledb.DATE, dir: oracledb.BIND_OUT },
        voRutaCoe: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
        voError: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
      }
    );

    const resultEX = EX.outBinds;
    console.log(resultEX);
    if (resultEX.voError === null) {
      await connection.commit();
    } else {
      await connection.rollback();
    }

    res.status(200).json(resultEX);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
