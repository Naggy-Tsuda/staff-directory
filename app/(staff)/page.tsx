"use client";

import { useEffect, useState } from "react";
import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

type Staff = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
};

export default function StaffPage() {
  const [rows, setRows] = useState<Staff[]>([]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [isMounted, setIsMounted] = useState(false); // Add this state

  const [editingId, setEditingId] = useState<number | null>(null);


  useEffect(() => {
    console.log('email cahnged')
  }, [email]);

  useEffect(() => {
    setIsMounted(true); // Triggers once running safely in the browser
    loadStaff();
  }, []);

  async function loadStaff() {
    const { data, error } = await supabase
      .from("staff")
      .select("*")
      .order("id");

    if (!error && data) {
      setRows(data);
    }
  }

  async function saveStaff() {
    if (editingId === null) {
      const { error } = await supabase.from("staff").insert({
        first_name: firstName,
        last_name: lastName,
        email: email,
      });

      if (error) {
        alert(error.message);
        return;
      }
    } else {
      const { error } = await supabase
        .from("staff")
        .update({
          first_name: firstName,
          last_name: lastName,
          email: email,
        })
        .eq("id", editingId);

      if (error) {
        alert(error.message);
        return;
      }
    }

    // Clear the form
    setFirstName("");
    setLastName("");
    setEmail("");
    setEditingId(null);

    // Reload the grid
    loadStaff();
  }

  function editStaff(staff: Staff) {
    setEditingId(staff.id);
    setFirstName(staff.first_name);
    setLastName(staff.last_name);
    setEmail(staff.email);
  }

  // --- NEW DELETE FUNCTION ---
  async function handleDelete(id: number) {
    if (!window.confirm("Are you sure you want to delete this staff member?")) {
      return;
    }

    const { error } = await supabase
      .from("staff")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    // If deleting the item currently being edited, reset the form
    if (editingId === id) {
      setEditingId(null);
      setFirstName("");
      setLastName("");
      setEmail("");
    }

    loadStaff();
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "first_name", headerName: "First Name", flex: 1 },
    { field: "last_name", headerName: "Last Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1.5 },
    {
      field: "edit",
      headerName: "",
      width: 100,
      renderCell: (params) => (
        <Button onClick={() => editStaff(params.row)}>
          Edit
        </Button>
      ),
    },
    {
      field: "delete",
      headerName: "",
      width: 100,
      renderCell: (params) => (
        <Button color="error" onClick={() => handleDelete(params.row.id)}>
          Delete
        </Button>
      ),
    },
  ];


  // GUARD - If page not mounded, do nothing
  // Stop server pre-rendering of the UI elements
  if (!isMounted) {
    return null; // Alternatively, return a simple skeleton or loading text
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Staff
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack spacing={2}>
          <TextField
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <TextField
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button variant="contained" onClick={saveStaff}>
            {editingId === null ? "Add Staff" : "Update Staff"}
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ height: 400 }}>
        <DataGrid
          rows={rows}
          columns={columns}
        />
      </Paper>
    </Box>
  );
}