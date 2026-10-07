import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import path from 'node:path';

const dataDirectory = process.env.DATA_DIR || './data';
const filePath = path.join(dataDirectory, 'citas-oftalmologia.json');

async function readAppointments() {
  await mkdir(dataDirectory, { recursive: true });
  try {
    return JSON.parse(await readFile(filePath, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    await writeFile(filePath, '[]\n', 'utf8');
    return [];
  }
}

export async function listEyeAppointments() {
  return readAppointments();
}

export async function findEyeAppointment(id) {
  const appointments = await readAppointments();
  return appointments.find((appointment) => appointment.id === id) ?? null;
}

export async function createEyeAppointment(input, patient) {
  const appointments = await readAppointments();
  const appointment = {
    id: randomUUID(),
    pacienteId: patient.id,
    paciente: patient.nombre,
    diagnostico: patient.diagnostico,
    motivo: input.motivo.trim(),
    fecha: input.fecha,
    hora: input.hora,
    estado: 'confirmado',
    creadoEn: new Date().toISOString()
  };
  appointments.push(appointment);
  await writeFile(filePath, `${JSON.stringify(appointments, null, 2)}\n`, 'utf8');
  return appointment;
}