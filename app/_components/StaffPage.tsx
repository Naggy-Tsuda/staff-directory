"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { createClient } from "@/lib/supabase/client";
import { LogoutButton } from "./LogoutButton";

const supabase = createClient();

type Staff = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  subject: string;
};

export default function StaffPage() {
  const supabase = useMemo(() => createClient(), []);
  const [rows, setRows] = useState<Staff[]>([]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");

  const [isMounted, setIsMounted] = useState(false); // Add this state

  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
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
        subject: subject,
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
          subject: subject,
        })
        .eq("id", editingId);

      if (error) {
        alert(error.message);
        return;
      }
    }

    setFirstName("");
    setLastName("");
    setEmail("");
    setSubject("");
    setEditingId(null);

    loadStaff();
  }

  function editStaff(staff: Staff) {
    setEditingId(staff.id);
    setFirstName(staff.first_name);
    setLastName(staff.last_name);
    setEmail(staff.email);
    setSubject(staff.subject);
  }

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

    if (editingId === id) {
      setEditingId(null);
      setFirstName("");
      setLastName("");
      setEmail("");
      setSubject("");
    }

    loadStaff();
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "first_name", headerName: "First Name", flex: 1 },
    { field: "last_name", headerName: "Last Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1.5 },
    { field: "subject", headerName: "Subject", flex: 1.5 },

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
      <LogoutButton />
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

          <TextField
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
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