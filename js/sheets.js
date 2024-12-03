const headers = ['ID', 'Cliente', 'Modelo', 'Problema']; // Modifica esto según tu hoja


let events;

async function getEvents() {
    let response;
    try {
        response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '1KyvjAky6QLN12AG9JGN624rsIAsTUXcJ0sQiutb1I2g',
            range: 'Events!A:G', // Asegúrate de que el rango sea correcto
        });
    } catch (err) {
        console.error('Error al obtener datos:', err);
        return;
    }

    const range = response.result;
    if (!range || !range.values || range.values.length === 0) {
        console.warn('No se encontraron datos.');
        document.getElementById('content').innerText = 'No se encontraron datos.';
        return;
    }

    console.log('Datos crudos:', range.values);

    // Mapeo manual de columnas a propiedades del objeto
    const columnMapping = {
        0: 'id',            // Columna A
        1: 'nombreEvento',  // Columna B
        2: 'fecha',         // Columna C
        3: 'ubicacion',     // Columna D
        4: 'descripcion',   // Columna E
        5: 'estado',        // Columna F
        6: 'comentarios'    // Columna G
    };

    // Ignorar la primera fila (encabezados)
    const rows = range.values.slice(1);

    // Crear objetos estandarizados
    const events = rows.map(row => {
        const event = {};
        Object.keys(columnMapping).forEach(index => {
            event[columnMapping[index]] = row[index] || null; // Usa `null` si no hay datos
        });
        return event;
    });

    console.log('Eventos procesados:', events);

    // Mostrar en el HTML
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = events.map(event => 
        `<div class="event">
            <strong>ID:</strong> ${event.id || 'N/A'} <br>
            <strong>Nombre del Evento:</strong> ${event.nombreEvento || 'N/A'} <br>
            <strong>Fecha:</strong> ${event.fecha || 'N/A'} <br>
            <strong>Ubicación:</strong> ${event.ubicacion || 'N/A'} <br>
            <strong>Descripción:</strong> ${event.descripcion || 'N/A'} <br>
            <strong>Estado:</strong> ${event.estado || 'N/A'} <br>
            <strong>Comentarios:</strong> ${event.comentarios || 'N/A'} <br>
        </div><hr>`
    ).join('');
}
