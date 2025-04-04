import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Snackbar,
  Alert,
  TableContainer,
  Paper,
  IconButton
} from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const getApiBaseUrl = () => {
    const protocol = window.location.protocol === "https:" ? "https" : "http";
    const baseUrl = process.env.REACT_APP_API_BASE_URL.replace(/^https?:\/\//, "");
    return `${protocol}://${baseUrl}`;
  };
  

export const Konfigurasi = () => {
  return (
    <div>Konfigurasi</div>
  )
}
