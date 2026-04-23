import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-81b5d14c/health", (c) => {
  return c.json({ status: "ok" });
});

// ==================== AUTH ENDPOINTS ====================

// Student login (no password, just ID + name)
app.post("/make-server-81b5d14c/auth/student-login", async (c) => {
  try {
    const { studentId, fullName } = await c.req.json();

    if (!studentId || !fullName) {
      return c.json({ error: "Student ID and full name are required" }, 400);
    }

    // Check if account exists
    const { data: existingAccount } = await supabase
      .from('accounts')
      .select('*')
      .eq('student_id', studentId)
      .eq('role', 'student')
      .single();

    let accountId;

    if (existingAccount) {
      // Update last login
      await supabase
        .from('accounts')
        .update({
          last_login: new Date().toISOString(),
          full_name: fullName // Update name in case it changed
        })
        .eq('id', existingAccount.id);
      accountId = existingAccount.id;
    } else {
      // Create new student account
      const { data: newAccount, error: createError } = await supabase
        .from('accounts')
        .insert({
          student_id: studentId,
          full_name: fullName,
          role: 'student',
          last_login: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) {
        console.log('Error creating student account:', createError);
        return c.json({ error: `Failed to create account: ${createError.message}` }, 500);
      }
      accountId = newAccount.id;
    }

    // Record login history
    const { error: historyError } = await supabase
      .from('login_history')
      .insert({
        account_id: accountId,
        student_id: studentId,
        full_name: fullName,
        role: 'student',
        login_time: new Date().toISOString()
      });

    if (historyError) {
      console.log('Error recording login history:', historyError);
    }

    return c.json({
      success: true,
      accountId,
      message: 'Student login successful'
    });

  } catch (error) {
    console.log('Student login error:', error);
    return c.json({ error: `Login failed: ${error.message}` }, 500);
  }
});

// Admin login
app.post("/make-server-81b5d14c/auth/admin-login", async (c) => {
  try {
    const { username, password } = await c.req.json();

    // Simple check - in production use proper password hashing
    if (username !== 'admin' || password !== 'admin123') {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    // Check if admin account exists
    const { data: existingAccount } = await supabase
      .from('accounts')
      .select('*')
      .eq('student_id', username) // Using student_id field for admin username
      .eq('role', 'admin')
      .single();

    let accountId;

    if (existingAccount) {
      // Update last login
      await supabase
        .from('accounts')
        .update({ last_login: new Date().toISOString() })
        .eq('id', existingAccount.id);
      accountId = existingAccount.id;
    } else {
      // Create admin account
      const { data: newAccount, error: createError } = await supabase
        .from('accounts')
        .insert({
          student_id: username,
          full_name: 'Administrator',
          role: 'admin',
          last_login: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) {
        console.log('Error creating admin account:', createError);
        return c.json({ error: `Failed to create account: ${createError.message}` }, 500);
      }
      accountId = newAccount.id;
    }

    // Record login history
    const { error: historyError } = await supabase
      .from('login_history')
      .insert({
        account_id: accountId,
        student_id: username,
        full_name: 'Administrator',
        role: 'admin',
        login_time: new Date().toISOString()
      });

    if (historyError) {
      console.log('Error recording admin login history:', historyError);
    }

    return c.json({
      success: true,
      accountId,
      message: 'Admin login successful'
    });

  } catch (error) {
    console.log('Admin login error:', error);
    return c.json({ error: `Login failed: ${error.message}` }, 500);
  }
});

// ==================== MEDICINE ENDPOINTS ====================

// Get all medicines
app.get("/make-server-81b5d14c/medicines", async (c) => {
  try {
    const { data, error } = await supabase
      .from('medicine_inventory')
      .select('*')
      .order('medicine_name');

    if (error) {
      console.log('Error fetching medicines:', error);
      return c.json({ error: `Failed to fetch medicines: ${error.message}` }, 500);
    }

    return c.json(data);
  } catch (error) {
    console.log('Get medicines error:', error);
    return c.json({ error: `Failed to fetch medicines: ${error.message}` }, 500);
  }
});

// Add new medicine
app.post("/make-server-81b5d14c/medicines", async (c) => {
  try {
    const medicine = await c.req.json();

    const { data, error } = await supabase
      .from('medicine_inventory')
      .insert({
        medicine_name: medicine.name,
        amount: medicine.stock,
        unit: medicine.unit,
        description: medicine.description
      })
      .select()
      .single();

    if (error) {
      console.log('Error adding medicine:', error);
      return c.json({ error: `Failed to add medicine: ${error.message}` }, 500);
    }

    return c.json(data);
  } catch (error) {
    console.log('Add medicine error:', error);
    return c.json({ error: `Failed to add medicine: ${error.message}` }, 500);
  }
});

// Update medicine
app.put("/make-server-81b5d14c/medicines/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();

    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (updates.name) updateData.medicine_name = updates.name;
    if (updates.stock !== undefined) updateData.amount = updates.stock;
    if (updates.unit) updateData.unit = updates.unit;
    if (updates.description) updateData.description = updates.description;

    const { data, error } = await supabase
      .from('medicine_inventory')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.log('Error updating medicine:', error);
      return c.json({ error: `Failed to update medicine: ${error.message}` }, 500);
    }

    return c.json(data);
  } catch (error) {
    console.log('Update medicine error:', error);
    return c.json({ error: `Failed to update medicine: ${error.message}` }, 500);
  }
});

// Delete medicine
app.delete("/make-server-81b5d14c/medicines/:id", async (c) => {
  try {
    const id = c.req.param('id');

    const { error } = await supabase
      .from('medicine_inventory')
      .delete()
      .eq('id', id);

    if (error) {
      console.log('Error deleting medicine:', error);
      return c.json({ error: `Failed to delete medicine: ${error.message}` }, 500);
    }

    return c.json({ success: true });
  } catch (error) {
    console.log('Delete medicine error:', error);
    return c.json({ error: `Failed to delete medicine: ${error.message}` }, 500);
  }
});

// ==================== APPOINTMENT ENDPOINTS ====================

// Get all appointments
app.get("/make-server-81b5d14c/appointments", async (c) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.log('Error fetching appointments:', error);
      return c.json({ error: `Failed to fetch appointments: ${error.message}` }, 500);
    }

    return c.json(data);
  } catch (error) {
    console.log('Get appointments error:', error);
    return c.json({ error: `Failed to fetch appointments: ${error.message}` }, 500);
  }
});

// Create appointment
app.post("/make-server-81b5d14c/appointments", async (c) => {
  try {
    const appointment = await c.req.json();

    const { data, error } = await supabase
      .from('appointments')
      .insert({
        student_id: appointment.studentId,
        student_name: appointment.studentName,
        appointment_date: appointment.date,
        appointment_time: appointment.time,
        reason: appointment.reason,
        status: appointment.status || 'pending'
      })
      .select()
      .single();

    if (error) {
      console.log('Error creating appointment:', error);
      return c.json({ error: `Failed to create appointment: ${error.message}` }, 500);
    }

    return c.json(data);
  } catch (error) {
    console.log('Create appointment error:', error);
    return c.json({ error: `Failed to create appointment: ${error.message}` }, 500);
  }
});

// Update appointment
app.put("/make-server-81b5d14c/appointments/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();

    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (updates.status) updateData.status = updates.status;
    if (updates.date) updateData.appointment_date = updates.date;
    if (updates.time) updateData.appointment_time = updates.time;
    if (updates.reason) updateData.reason = updates.reason;

    const { data, error } = await supabase
      .from('appointments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.log('Error updating appointment:', error);
      return c.json({ error: `Failed to update appointment: ${error.message}` }, 500);
    }

    return c.json(data);
  } catch (error) {
    console.log('Update appointment error:', error);
    return c.json({ error: `Failed to update appointment: ${error.message}` }, 500);
  }
});

// Delete appointment
app.delete("/make-server-81b5d14c/appointments/:id", async (c) => {
  try {
    const id = c.req.param('id');

    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) {
      console.log('Error deleting appointment:', error);
      return c.json({ error: `Failed to delete appointment: ${error.message}` }, 500);
    }

    return c.json({ success: true });
  } catch (error) {
    console.log('Delete appointment error:', error);
    return c.json({ error: `Failed to delete appointment: ${error.message}` }, 500);
  }
});

// ==================== LOGIN HISTORY ENDPOINTS ====================

// Get login history (admin only)
app.get("/make-server-81b5d14c/login-history", async (c) => {
  try {
    const { data, error } = await supabase
      .from('login_history')
      .select('*')
      .order('login_time', { ascending: false })
      .limit(100);

    if (error) {
      console.log('Error fetching login history:', error);
      return c.json({ error: `Failed to fetch login history: ${error.message}` }, 500);
    }

    return c.json(data);
  } catch (error) {
    console.log('Get login history error:', error);
    return c.json({ error: `Failed to fetch login history: ${error.message}` }, 500);
  }
});

Deno.serve(app.fetch);