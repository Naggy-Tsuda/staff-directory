"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { createClient } from "@/lib/supabase/client";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

type Staff = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  subject: string;
};

export default function StaffPage() {
  // Create supabase instance to use supabase functions
  const supabase = useMemo(() => createClient(), []);
  const [rows, setRows] = useState<Staff[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  // When this is number we are editing that person
  const [editingId, setEditingId] = useState<number | null>(null);

  // Fetch staff data from Supabase
  const loadStaff = useCallback(async () => {
    const { data, error } = await supabase
      .from("staff")
      .select("*")
      .order("id");

    if (!error && data) {
      setRows(data);
    }

  }, [supabase])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadStaff();
  }, [loadStaff]);

  // Checks if form is filled in right, returns errors
  function validateForm() {
    const errors: Record<string, string> = {};

    if (!firstName.trim()) {
      errors.firstName = "First name is required";
    } else if (firstName.length > 10) {
      errors.firstName = "First name must be 10 characters or less"
    }

    if (!lastName.trim()) {
      errors.lastName = "Last name is required";
    } else if (lastName.length > 10) {
      errors.lastName = "Last name must be 10 characters or less"
    }

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = "Enter a valid email adress";
    }

    if (!subject.trim()) {
      errors.subject = "Subject is required";
    }

    return errors;
  }

  // When the user types save it and hide that box's error message
  function handleFieldChange(
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string,
    field: string,
  ) {
    setter(value);
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  // Add a new person or updates the person we are editing
  async function saveStaff() {
    // Stops us if we are already editing (so no double clicks)
    if (isSaving) {
      return;
    }

    // If the form is wrong, show the errors and stop
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSaving(true)

    try {

      // No editingId means we are adding a brand new person
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
        // editingId is set, so we update that person instead
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

      // Clear the form so it's ready for the next person
      setFirstName("");
      setLastName("");
      setEmail("");
      setSubject("");
      setEditingId(null);

      // Refresh the table so we can see the new/ updated person
      loadStaff();
    } catch {
      alert("Something went wrong.")
    } finally {
      // Always let the button be clickable again
      setIsSaving(false)
    }
  }

  // Fill the form with the person's info when we click edit
  function editStaff(staff: Staff) {
    setEditingId(staff.id);
    setFirstName(staff.first_name);
    setLastName(staff.last_name);
    setEmail(staff.email);
    setSubject(staff.subject);
  }

  // Deletes a person but asks first just in case
  async function handleDelete(id: number) {
    // Display confirmation message
    if (!window.confirm("Are you sure you want to delete this staff member?")) {
      return;
    }

    const { error } = await supabase
      .from("staff")
      .delete()
      .eq("id", id);

    // Display error if Supabase failed
    if (error) {
      alert(error.message);
      return;
    }

    // If we were editing the person we deleted, clear the form
    if (editingId === id) {
      setEditingId(null);
      setFirstName("");
      setLastName("");
      setEmail("");
      setSubject("");
    }

    loadStaff();
  }

  // The columns shown in the table
  const columns: GridColDef[] = [
    { field: "first_name", headerName: "First Name", flex: 1 },
    { field: "last_name", headerName: "Last Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1.5 },
    { field: "subject", headerName: "Subject", flex: 1.5 },
    {
      field: "edit",
      headerName: "",
      width: 120,
      // The edit button for each row
      renderCell: (params) => (
        <Button onClick={() => editStaff(params.row)} startIcon={<EditIcon />}>
          Edit
        </Button>
      ),
    },
    {
      field: "delete",
      headerName: "",
      width: 120,
      // The delete buttons for each row
      renderCell: (params) => (
        <Button color="error" onClick={() => handleDelete(params.row.id)} startIcon={<DeleteIcon />}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Staff
      </Typography>

      {/* Form section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack spacing={2}>
          <TextField
            label="First Name"
            value={firstName}
            onChange={(e) => handleFieldChange(setFirstName, e.target.value, "firstName")}
            error={!!formErrors.firstName}
            helperText={formErrors.firstName}
          />

          <TextField
            label="Last Name"
            value={lastName}
            onChange={(e) => handleFieldChange(setLastName, e.target.value, "lastName")}
            error={!!formErrors.lastName}
            helperText={formErrors.lastName}
          />

          <TextField
            label="Email"
            value={email}
            onChange={(e) => handleFieldChange(setEmail, e.target.value, "email")}
            error={!!formErrors.email}
            helperText={formErrors.email}
          />

          <TextField
            label="Subject"
            value={subject}
            onChange={(e) => handleFieldChange(setSubject, e.target.value, "subject")}
            error={!!formErrors.subject}
            helperText={formErrors.subject}
          />

          <Button variant="contained" onClick={saveStaff}>
            {editingId === null ? "Add Staff" : "Update Staff"}
          </Button>
        </Stack>
      </Paper>


      {/* Table section */}
      <Paper sx={{ height: 400 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          showToolbar
        />
      </Paper>
    </Box>
  );
}