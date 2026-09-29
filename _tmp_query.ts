const mongoose = require('mongoose');

(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/salita_municipal');
    const db = mongoose.connection.db;
    const col = db.collection('especialidads');
    const docs = await col.find({}).toArray();
    for (const d of docs) {
        const created = d.createdAt ? new Date(d.createdAt).toISOString() : '';
        console.log(d._id.toString(), '|', JSON.stringify(d.nombre), '|', JSON.stringify(d.descripcion || ''));
    }
    const medicos = await db.collection('medicos').find({}).toArray();
    console.log('\n-- referencias en medicos (+consultorios) --');
    for (const m of medicos) {
        console.log('medico', m.nombre || m._id.toString(), '-> especialidad:', String(m.especialidad));
    }
    const consultorios = await db.collection('consultorios').find({}).toArray();
    for (const c of consultorios) {
        console.log('consultorio', c.numeroConsultorio, '-> especialidad:', String(c.especialidad), 'medico:', String(c.medico));
    }
    const turnos = await db.collection('turnos').find({}, { projection: { especialidad: 1, estado: 1 } }).toArray();
    console.log('\n-- especialidades guardadas en turnos --');
    for (const t of turnos) {
        console.log('turno', t._id.toString(), '->', JSON.stringify(t.especialidad), '|', t.estado);
    }
    await mongoose.disconnect();
})().catch((e) => { console.error(e.message); process.exit(1); });