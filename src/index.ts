import express from "express";
import PDFDocument from "pdfkit";
import { Response, Request } from "express";
import path from "path";
import fs from "fs";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());

const generatePdf = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
    });
    const filePath = path.join(__dirname, "output.pdf");
    const writeStream = fs.createWriteStream(filePath);

    doc.pipe(writeStream);

    const addHeader = () => {
      // Agregar imagen de logo
      const logoPath = path.join(__dirname, "../images/descarga.png");
      doc.image(logoPath, 30, 10, { width: 150, height: 100 });

      // Posición inicial para los textos
      const textStartX = 210; // Ajusta esto según sea necesario
      const textStartY = 30;

      // Información del usuario
      doc
        .fontSize(10)
        .text("Usuario: ", textStartX, textStartY, { continued: true })
        .fontSize(10)
        .fillColor("gray")
        .text("Andres Moreno");

      doc
        .fontSize(10)
        .fillColor("black")
        .text("Creacion: ", textStartX, textStartY + 15, { continued: true })
        .fontSize(10)
        .fillColor("gray")
        .text("2024-05-09");

      // Información del software
      doc
        .fontSize(10)
        .fillColor("black")
        .text("Software Gtech - version 1.50.0.0", textStartX + 180, textStartY)
        .text("www.toc.com.co - ® Firma", textStartX + 200, textStartY + 15);

      // Agregar título centrado
      doc
        .fontSize(20)
        .fillColor("black")
        .text("FACTURA DE VENTA", 60, 100, { align: "center" })
        .moveDown();
    };

    const addPacienteModule = () => {
      // Posición inicial para el módulo de paciente
      const startX = 50;
      const startY = 120;

      // Dibuja un rectángulo alrededor del módulo de paciente
      doc.rect(startX, startY, 500, 180).stroke();

      // Título del módulo de paciente
      doc
        .fontSize(15)
        .text("PACIENTE", startX, startY + 5, { align: "center" });

      // Añadir una línea de separación debajo del título
      doc
        .moveTo(startX, startY + 20)
        .lineTo(startX + 500, startY + 20)
        .stroke();

      // Información del paciente
      const patientInfo = [
        { label: "Nombre:", value: "BLANCA NIEVES FLOREZ", x: 50, y: 150 },
        { label: "Género:", value: "FEMENINO", x: 50, y: 165 },
        { label: "Número:", value: "1234567890", x: 230, y: 165 },
        {
          label: "Fecha de Nacimiento:",
          value: "viernes, 22/08/1948",
          x: 370,
          y: 165,
        },

        {
          label: "Identificación - Propiedad:",
          value: "PROPIA",
          x: 50,
          y: 180,
        },
        { label: "Tipo:", value: "CEDULA DE CIUDADANIA", x: 230, y: 180 },
        {
          label: "Edad:",
          value: "75 Año(s) 6 Mes(es) 8 Día(s)",
          x: 395,
          y: 180,
        },
        { label: "Estado Civil:", value: "CASADO(A)", x: 50, y: 195 },
        {
          label: "Teléfono(s):",
          value: "1234567890:0987654321",
          x: 385,
          y: 195,
        },

        { label: "Ocupación:", value: "NO APLICA", x: 50, y: 210 },
        {
          label: "Correo(s) Electrónico(s):",
          value: "NO TIENE",
          x: 50,
          y: 225,
        },
        {
          label: "Dirección de residencia:",
          value: "VEREDA CHIYURCO - PITALITO",
          x: 50,
          y: 240,
        },
        {
          label: "Entidad Aseguradora:",
          value: "E.P.S. SANITAS S A S",
          x: 50,
          y: 255,
        },
        {
          label: "Entidad Pagadora:",
          value: "IBOGCU2225 - SANITAS",
          x: 50,
          y: 270,
        },
        { label: "Plan:", value: "SUBSIDIADO", x: 50, y: 285 },
        { label: "Tipo de Afiliado:", value: "BENEFICIARIO", x: 220, y: 285 },
        { label: "Tipo de Usuario:", value: "SUBSIDIADO", x: 410, y: 285 },
      ];

      // Añadir información del paciente
      patientInfo.forEach((info) => {
        doc.fontSize(8).fillColor("black");
        doc.text(info.label, info.x, info.y, { continued: true });
        doc.text(info.value, info.x + 8, info.y);
      });
    };

    const addDiagnosisModule = () => {
      // Posición inicial para el módulo de diagnóstico
      const startX = 50;
      const startY = 300;

      // Dibuja un rectángulo alrededor del módulo de diagnóstico
      doc.rect(startX, startY, 500, 60).stroke();

      // Título del módulo de diagnóstico
      doc
        .fontSize(15)
        .text("DIAGNÓSTICO", startX, startY + 5, { align: "center" })
        .moveDown();

      // Añadir una línea de separación debajo del título
      doc
        .moveTo(startX, startY + 20)
        .lineTo(startX + 500, startY + 20)
        .stroke();

      // Añadir líneas verticales para separar las columnas
      const lineXPositions = [startX + 40, startX + 120];
      lineXPositions.forEach((lineX) => {
        doc
          .moveTo(lineX, startY + 20)
          .lineTo(lineX, startY + 60)
          .stroke();
      });

      // Añadir una línea de separación ente las columnas con sus filas
      doc
        .moveTo(startX, startY + 40)
        .lineTo(startX + 500, startY + 40)
        .stroke();

      // Información del diagnóstico
      doc
        .fontSize(10)
        .text("No.", startX + 10, startY + 25)
        .text("Código", startX + 60, startY + 25)
        .text("Nombre", startX + 290, startY + 25)
        .moveDown();

      const diagnosisInfo = [
        { no: "1", code: "C181", name: "TUMOR MALIGNO DEL APÉNDICE" },
      ];

      diagnosisInfo.forEach((info) => {
        doc
          .fontSize(10)
          .text(info.no, startX + 15, startY + 45, { continued: true })
          .text(info.code, startX + 60, startY + 45, { continued: true })
          .text(info.name, startX + 200, startY + 45);
      });
    };

    const addInfoFacturaModule = () => {
      // Posición inicial para el módulo de factura
      const startX = 50;
      const startY = 360;

      // Dibuja un rectángulo alrededor del módulo de factura
      doc.rect(startX, startY, 500, 85).stroke();

      // Título del módulo de factura
      doc.fontSize(15).text("INFORMACION DE LA FACTURA", startX, startY + 5, {
        align: "center",
      });

      // Añadir una línea de separación debajo del título
      doc
        .moveTo(startX, startY + 20)
        .lineTo(startX + 500, startY + 20)
        .stroke();

      // Información de la factura
      const invoiceInfo = [
        { label: "Número:", value: "A1 107150", x: 10, y: 25 },
        { label: "Fecha:", value: "23/05/2024", x: 415, y: 25 },
        {
          label: "Sede:",
          value: "UNIDAD ONCOLOGICA SURCOLOMBIANA - NEIVA (HUILA) - SEDE 1",
          x: 10,
          y: 40,
        },
        {
          label: "Medio de Pago:",
          value: "TRANSFERENCIA DÉBITO",
          x: 10,
          y: 55,
        },
        { label: "Forma de Pago:", value: "CREDITO", x: 210, y: 55 },
        { label: "Fecha de Vencimiento:", value: "2024-05-30", x: 350, y: 55 },

        { label: "Fecha de Ingreso:", value: "2024-05-09", x: 10, y: 70 },

        { label: "Fecha de Egreso:", value: "2024-05-29", x: 180, y: 70 },
        {
          label: "Fecha de Expedición:",
          value: "2024-05-30 14:40",
          x: 330,
          y: 70,
        },
      ];

      // Añadir información de la factura
      invoiceInfo.forEach((info) => {
        doc.fontSize(9).fillColor("black");
        doc.text(info.label, startX + info.x, startY + info.y, {
          continued: true,
        });
        doc.text(info.value, startX + info.x + 3, startY + info.y);
      });
    };

    const addEntidadPagadoraModule = () => {
      // Posición inicial para el módulo de factura
      const startX = 50;
      const startY = 445;

      // Dibuja un rectángulo alrededor del módulo de factura
      doc.rect(startX, startY, 500, 105).stroke();

      // Título del módulo de factura
      doc.fontSize(15).text("ENTIDAD PAGADORA", startX, startY + 5, {
        align: "center",
      });

      // Añadir una línea de separación debajo del título
      doc
        .moveTo(startX, startY + 20)
        .lineTo(startX + 500, startY + 20)
        .stroke();

      // Información de la factura
      const invoiceInfo = [
        { label: "Entidad:", value: "E.P.S. SANITAS S A S", x: 10, y: 30 },
        { label: "NIT:", value: "800251440-6", x: 420, y: 30 },
        {
          label: "Contrato:",
          value: "IBOGCU2225 - SANITAS",
          x: 10,
          y: 45,
        },
        {
          label: "Numero de Poliza:",
          value: "560-88-9940000000060",
          x: 320,
          y: 45,
        },
        { label: "Numeros de Contrato:", value: "NUEVO", x: 10, y: 60 },
        {
          label: "Cobertura:",
          value: "PLAN DE BENEFICIOS EN SALUD",
          x: 305,
          y: 60,
        },

        { label: "Modalidades de Pago:", value: "POR SERVICIO", x: 10, y: 75 },

        {
          label: "Numeros de Autorización:",
          value: "123456789,0987654321 ",
          x: 10,
          y: 90,
        },
        {
          label: "Periodo de Pago:",
          value: "30",
          x: 410,
          y: 90,
        },
      ];

      // Añadir información de la factura
      invoiceInfo.forEach((info) => {
        doc.fontSize(9).fillColor("black");
        doc.text(info.label, startX + info.x, startY + info.y, {
          continued: true,
        });
        doc.text(info.value, startX + info.x + 3, startY + info.y);
      });
    };

    const addTableModule = () => {
      // Posición inicial para el módulo de tabla
      const startX = 50;
      const startY = 550;

      // Ancho de cada columna
      const columnWidths = [20, 60, 60, 140, 35, 50, 50, 40, 45];

      // Altura de la fila del encabezado y de las filas de datos
      const headerHeight = 25;
      const rowHeight = 30;

      // Datos de la tabla
      const tableData = [
        [
          "No",
          "Código 1",
          "Código 2",
          "Descripción",
          "Cantidad",
          "Valor Unitario",
          "Tipo Pago Compartido",
          "Valor Compartido",
          "Valor Total",
        ],
        [
          "1",
          "992511",
          "992511",
          "MONOTERAPIA ANTINEOPLASICA DE ALTA TOXICIDAD - (PBS)",
          "1",
          "$267.458",
          "COPAGO",
          "$0",
          "$267.458",
        ],
        [
          "2",
          "992511",
          "02-IN018034",
          "EQUIPO PARA BOMBA INFUSION ESTANDAR EN UNIDAD(ES) - (.) [FRESENIUS]",
          "1",
          "$35.319",
          "COPAGO",
          "$0",
          "$35.319",
        ],
        [
          "3",
          "19932754-04",
          "CLORURO DE SODIO",
          "SSN 0.9% X 100 ML (CLORURO DE SODIO) X 0.9 GRAMO(S) EN SOLUCION INYECTABLE - (.) [FRESENIUS]",
          "2",
          "$1.616",
          "COPAGO",
          "$0",
          "$3.232",
        ],
        [
          "4",
          "20169679-01",
          "PERSIVI-A®",
          "BEVACIZUMAB X 100 MILIGRAMO(S) EN SOLUCION INYECTABLE - (.) [DR. REDDY'S LABORATORIES LIMITED]",
          "8",
          "$1.208.536",
          "COPAGO",
          "$0",
          "$9.668.288",
        ],
      ];

      // Dibujar encabezados de la tabla
      doc
        .rect(
          startX,
          startY,
          columnWidths.reduce((a, b) => a + b, 0),
          headerHeight
        )
        .stroke();
      let currentX = startX;
      tableData[0].forEach((header, index) => {
        doc.fontSize(8).fillColor("black");
        doc.text(header, currentX, startY + 5, {
          width: columnWidths[index],
          align: "center",
        });
        currentX += columnWidths[index];
      });

      // Dibujar filas de datos
      let currentY = startY + headerHeight;
      tableData.slice(1).forEach((row) => {
        currentX = startX;
        row.forEach((cell, index) => {
          // Dibujar el borde alrededor de la celda
          doc.rect(currentX, currentY, columnWidths[index], rowHeight).stroke();
          doc.fontSize(7).fillColor("black");
          doc.text(cell, currentX, currentY + 5, {
            width: columnWidths[index],
            align: "center",
          });
          currentX += columnWidths[index];
        });
        currentY += rowHeight;
      });

      // Dibujar líneas verticales extendidas desde el encabezado hasta la última fila
      currentX = startX;
      columnWidths.forEach((width) => {
        doc.moveTo(currentX, startY).lineTo(currentX, currentY).stroke();
        currentX += width;
      });
      // Línea vertical derecha final
      doc.moveTo(currentX, startY).lineTo(currentX, currentY).stroke();
    };

    const addSummaryModule = () => {
      // Posición inicial para el módulo de resumen
      const startX = 50;
      const startY = 695;

      // Ancho del módulo
      const moduleWidth = 500;

      // Altura de cada fila de texto
      const rowHeight = 20;

      // Datos del resumen
      const summaryData = [
        {
          label: "Subtotal:",
          value:
            "NUEVE MILLONES NOVECIENTOS SETENTA Y CUATRO MIL DOSCIENTOS NOVENTA Y SIETE PESOS M/CTE",
          amount: "$9.974.297",
        },
        {
          label: "Valor asumido por el usuario:",
          value: "CERO PESOS M/CTE",
          amount: "$0",
        },
        { label: "Valor IVA:", value: "CERO PESOS M/CTE", amount: "$0" },
        {
          label: "Valor total a pagar:",
          value:
            "NUEVE MILLONES NOVECIENTOS SETENTA Y CUATRO MIL DOSCIENTOS NOVENTA Y SIETE PESOS M/CTE",
          amount: "$9.974.297",
        },
      ];

      // Dibujar el borde del módulo
      doc
        .rect(startX, startY, moduleWidth, summaryData.length * rowHeight)
        .stroke();

      // Añadir la información del resumen
      summaryData.forEach((item, index) => {
        const yPosition = startY + index * rowHeight;

        // Dibujar líneas horizontales entre las filas
        doc
          .moveTo(startX, yPosition)
          .lineTo(startX + moduleWidth, yPosition)
          .stroke();

        // Añadir la etiqueta y el valor combinados
        doc.fontSize(7).fillColor("black");
        const combinedText = `${item.label} ${item.value}`;
        doc.text(combinedText, startX + 5, yPosition + 5, {
          width: moduleWidth - 55,
        });

        // Dibujar la celda vertical antes del amount
        doc
          .moveTo(startX + moduleWidth - 55, yPosition)
          .lineTo(startX + moduleWidth - 55, yPosition + rowHeight)
          .stroke();

        // Añadir el amount en su propia celda
        doc.text(item.amount, startX + moduleWidth - 50, yPosition + 5, {
          width: 50,
          align: "center",
        });
      });

      // Dibujar la última línea horizontal al final del módulo
      doc
        .moveTo(startX, startY + summaryData.length * rowHeight)
        .lineTo(startX + moduleWidth, startY + summaryData.length * rowHeight)
        .stroke();
    };

    const addFooter = () => {
      const startX = 50;
      const startY = 780;

      doc
        .fontSize(8)
        .text("Observaciones:", startX, startY)
        .fillColor("gray")
        .text(
          "APLICACION 29/4/2024 OM 8/4/2024 AUT 264035063-263844249 VALIDACION 244643034112-243483759616",
          startX + 80,
          startY
        );

      doc
        .fillColor("black")
        .text(
          "---------------------------------------------",
          startX,
          startY + 10
        )
        .text("Elaborado por:", startX, startY)
        .text(
          "---------------------------------------------",
          startX + 400,
          startY + 10
        )
        .text("Nombre:", startX + 400, startY + 20)
        .text("Identificacion:", startX + 400, startY + 35)
        .text("Fecha:", startX + 400, startY + 50);
    };

    // Generar páginas
    let pageCount = 0;
    const maxPages = 5000;
    console.log("antes del while");

    while (pageCount < maxPages) {
      addHeader();
      addPacienteModule();
      addDiagnosisModule();
      addInfoFacturaModule();
      addEntidadPagadoraModule();
      addTableModule();
      addSummaryModule();
      // addFooter();
      pageCount++;

      if (pageCount < maxPages) {
        doc.addPage();
      }
    }
    console.log("Despues del while");

    doc.end();

    console.log("Despues del doc.end");

    writeStream.on("finish", () => {
      resolve(filePath);
    });

    writeStream.on("error", (err) => {
      reject(err);
    });
  });
};

// Endpoint para generar PDF
app.get("/generate_pdf", async (req: Request, res: Response) => {
  try {
    console.log("Extrañendo datos de la DB");
    //TODO:Crear funcion para traer datos con TYPEORM

    console.log("Entrando al endpoint");
    const filePath = await generatePdf();
    res.setHeader("Content-Disposition", "attachment; filename=factura.pdf");
    res.setHeader("Content-Type", "application/pdf");
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on("end", () => {
      fs.unlinkSync(filePath);
    });
    console.log("Saliendno del endpoint");
  } catch (err) {
    res.status(500).send("Error generando el PDF");
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
