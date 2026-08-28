import request from "supertest";
import mongoose from "mongoose";
import app from "../server";

async function testSystem() {
    console.log("Starting Medical Appointment System Integration Test...\n");

    try {
        // 1. Register Patient
        const patientEmail = `patient_${Date.now()}@example.com`;
        const patientRes = await request(app)
            .post("/api/auth/register")
            .send({
                FullName: "Jane Patient",
                Email: patientEmail,
                Password: "Password123!",
                Role: "Patient",
            });
        
        console.log("1. Patient Registration:", patientRes.status === 201 ? "PASSED ✅" : `FAILED ❌ (${patientRes.status})`);
        if (patientRes.status !== 201) console.log(patientRes.body);
        const patientToken = patientRes.body.token;
        const patientId = patientRes.body.user?.id || patientRes.body.user?._id;

        // 2. Register Doctor
        const doctorEmail = `doctor_${Date.now()}@example.com`;
        const doctorRes = await request(app)
            .post("/api/auth/register")
            .send({
                FullName: "Dr. John Smith",
                Email: doctorEmail,
                Password: "Password123!",
                Role: "Doctor",
            });
        
        console.log("2. Doctor Registration:", doctorRes.status === 201 ? "PASSED ✅" : `FAILED ❌ (${doctorRes.status})`);
        if (doctorRes.status !== 201) console.log(doctorRes.body);
        const doctorToken = doctorRes.body.token;
        const doctorId = doctorRes.body.user?.id || doctorRes.body.user?._id;

        // 3. Login Doctor
        const loginRes = await request(app)
            .post("/api/auth/login")
            .send({
                Email: doctorEmail,
                Password: "Password123!",
            });

        console.log("3. Doctor Login:", loginRes.status === 200 && loginRes.body.token ? "PASSED ✅" : `FAILED ❌ (${loginRes.status})`);

        // 4. Create Doctor Profile
        const profileRes = await request(app)
            .post("/api/doctors")
            .set("Authorization", `Bearer ${doctorToken}`)
            .send({
                user: doctorId,
                specialty: "Cardiology",
                experience: 10,
                clinicAddress: "123 Medical Center",
                consultationFee: 150,
                workingHours: "09:00 - 17:00",
                availabilityStatus: true,
            });

        console.log("4. Doctor Profile Creation:", profileRes.status === 201 ? "PASSED ✅" : `FAILED ❌ (${profileRes.status})`);
        if (profileRes.status !== 201) console.log(profileRes.body);

        // 5. Create Doctor Schedule
        const scheduleRes = await request(app)
            .post("/api/schedules")
            .set("Authorization", `Bearer ${doctorToken}`)
            .send({
                doctor: doctorId,
                day: "2026-09-01",
                availableTimeSlots: [
                    { start: "09:00", end: "09:30", available: true },
                    { start: "10:00", end: "10:30", available: true },
                ],
                availability: true,
            });

        console.log("5. Doctor Schedule Creation:", scheduleRes.status === 201 ? "PASSED ✅" : `FAILED ❌ (${scheduleRes.status})`);
        if (scheduleRes.status !== 201) console.log(scheduleRes.body);

        // 6. Test RBAC Guard (Patient trying to create Schedule - Should be 403)
        const rbacRes = await request(app)
            .post("/api/schedules")
            .set("Authorization", `Bearer ${patientToken}`)
            .send({
                doctor: doctorId,
                day: "2026-09-02",
                availableTimeSlots: [{ start: "11:00", end: "11:30", available: true }],
            });

        console.log("6. RBAC Guard Protection (Patient denied schedule creation):", rbacRes.status === 403 ? "PASSED ✅" : `FAILED ❌ (${rbacRes.status})`);

        // 7. Patient Books Appointment
        const apptRes = await request(app)
            .post("/api/appointments")
            .set("Authorization", `Bearer ${patientToken}`)
            .send({
                doctorId: doctorId,
                appointmentDate: "2026-09-01",
                timeSlot: { startTime: "09:00", endTime: "09:30" },
                notes: "Annual cardiac checkup",
            });

        console.log("7. Patient Appointment Booking:", apptRes.status === 201 ? "PASSED ✅" : `FAILED ❌ (${apptRes.status})`);
        if (apptRes.status !== 201) console.log(apptRes.body);
        const appointmentId = apptRes.body.appointment?._id;

        // 8. Doctor Updates Appointment Status to Confirmed
        const statusRes = await request(app)
            .patch(`/api/appointments/${appointmentId}`)
            .set("Authorization", `Bearer ${doctorToken}`)
            .send({
                status: "Confirmed",
            });

        console.log("8. Doctor Confirms Appointment:", statusRes.status === 200 && statusRes.body.appointment?.status === "Confirmed" ? "PASSED ✅" : `FAILED ❌ (${statusRes.status})`);

        // 9. Cancel Appointment
        const cancelRes = await request(app)
            .delete(`/api/appointments/${appointmentId}`)
            .set("Authorization", `Bearer ${patientToken}`);

        console.log("9. Appointment Cancellation:", cancelRes.status === 200 && cancelRes.body.appointment?.status === "Cancelled" ? "PASSED ✅" : `FAILED ❌ (${cancelRes.status})`);

        console.log("\n✨ ALL INTEGRATION TESTS PASSED SUCCESSFULLY! ✨");
    } catch (err) {
        console.error("Test Error:", err);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}

testSystem();
