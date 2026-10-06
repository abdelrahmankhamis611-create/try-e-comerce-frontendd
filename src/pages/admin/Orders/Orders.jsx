import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

import useOrders from "../../../features/orders/hooks/useOrders";

/* =========================================================
   نفس الـ CSS القديم بتاعك، مع إضافة Pagination.
   كل الكلاسات متقيّدة بـ .ao-x
   عشان مفيش تعارض مع صفحة Orders بتاعة العميل.
   ========================================================= */
const css = `
/* ===== Page ===== */
.ao-x {
  width: 100%;
  min-height: 100vh;
  padding: 30px;
  box-sizing: border-box;
  overflow-x: hidden;
  background: #f8fafc;
  font-family: inherit;
}

/* ===== Header ===== */
.ao-x .ao-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

.ao-x .ao-header h2 {
  margin: 0 0 6px;
  color: #0f172a;
  font-size: 28px;
  font-weight: 700;
}

.ao-x .ao-header p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

.ao-x .ao-count {
  padding: 9px 15px;
  border: 1px solid #bfdbfe;
  border-radius: 9px;
  background: #eff6ff;
  color: #2563eb;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
}

/* ===== Filters ===== */
.ao-x .ao-filters {
  display: grid;
  grid-template-columns: minmax(250px, 1fr) 180px 180px auto;
  align-items: end;
  gap: 12px;
  width: 100%;
  margin-bottom: 20px;
  box-sizing: border-box;
}

.ao-x .ao-search-box {
  position: relative;
  width: 100%;
}

.ao-x .ao-search-icon {
  position: absolute;
  top: 50%;
  left: 13px;
  transform: translateY(-50%);
  font-size: 15px;
  pointer-events: none;
}

.ao-x .ao-search-box input,
.ao-x .ao-filter-select select {
  width: 100%;
  height: 42px;
  box-sizing: border-box;
  border: 1px solid #dbe2ea;
  border-radius: 9px;
  outline: none;
  background: #ffffff;
  color: #0f172a;
  font-family: inherit;
  font-size: 13px;
  transition:
    border-color .2s ease,
    box-shadow .2s ease;
}

.ao-x .ao-search-box input {
  padding: 0 14px 0 38px;
}

.ao-x .ao-search-box input:focus,
.ao-x .ao-filter-select select:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.ao-x .ao-filter-select {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ao-x .ao-filter-select label {
  color: #475569;
  font-size: 12px;
  font-weight: 700;
}

.ao-x .ao-filter-select select {
  padding: 0 10px;
  cursor: pointer;
}

.ao-x .ao-clear-filters {
  height: 42px;
  padding: 0 15px;
  border: 1px solid #fecaca;
  border-radius: 9px;
  background: #fff1f2;
  color: #dc2626;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all .2s ease;
}

.ao-x .ao-clear-filters:hover {
  background: #fee2e2;
  border-color: #fca5a5;
  color: #b91c1c;
}

/* ===== Loading / Error ===== */
.ao-x .ao-loading,
.ao-x .ao-error {
  width: 100%;
  padding: 40px 20px;
  box-sizing: border-box;
  border-radius: 12px;
  text-align: center;
  font-size: 14px;
}

.ao-x .ao-loading {
  background: #ffffff;
  color: #64748b;
}

.ao-x .ao-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
}

/* ===== Empty state ===== */
.ao-x .ao-empty {
  width: 100%;
  padding: 60px 20px;
  box-sizing: border-box;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #ffffff;
  text-align: center;
  box-shadow: 0 4px 18px rgba(15, 23, 42, 0.05);
}

.ao-x .ao-empty h3 {
  margin: 0 0 8px;
  color: #334155;
  font-size: 18px;
}

.ao-x .ao-empty p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.ao-x .ao-clear-results {
  margin-top: 18px;
  padding: 9px 16px;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  background: #eff6ff;
  color: #2563eb;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all .2s ease;
}

.ao-x .ao-clear-results:hover {
  background: #dbeafe;
  border-color: #93c5fd;
}

/* ===== Table ===== */
.ao-x .ao-table-wrap {
  width: 100%;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.06);
}

.ao-x .ao-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.ao-x .ao-table th,
.ao-x .ao-table td {
  padding: 14px 12px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
  box-sizing: border-box;
}

.ao-x .ao-table th {
  background: #f8fafc;
  color: #475569;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.ao-x .ao-table td {
  color: #334155;
  font-size: 13px;
  vertical-align: middle;
  overflow-wrap: anywhere;
}

.ao-x .ao-table tbody tr {
  transition: background .18s ease;
}

.ao-x .ao-table tbody tr:hover {
  background: #f8fafc;
}

.ao-x .ao-table tbody tr:last-child td {
  border-bottom: none;
}

.ao-x .ao-table th:nth-child(1),
.ao-x .ao-table td:nth-child(1) {
  width: 12%;
}

.ao-x .ao-table th:nth-child(2),
.ao-x .ao-table td:nth-child(2) {
  width: 18%;
}

.ao-x .ao-table th:nth-child(3),
.ao-x .ao-table td:nth-child(3) {
  width: 12%;
}

.ao-x .ao-table th:nth-child(4),
.ao-x .ao-table td:nth-child(4) {
  width: 12%;
}

.ao-x .ao-table th:nth-child(5),
.ao-x .ao-table td:nth-child(5) {
  width: 12%;
}

.ao-x .ao-table th:nth-child(6),
.ao-x .ao-table td:nth-child(6) {
  width: 10%;
}

.ao-x .ao-table th:nth-child(7),
.ao-x .ao-table td:nth-child(7) {
  width: 24%;
}

/* ===== Order id / customer / total ===== */
.ao-x .ao-id {
  display: inline-flex;
  align-items: center;
  padding: 5px 8px;
  border-radius: 7px;
  background: #eff6ff;
  color: #2563eb;
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
}

.ao-x .ao-customer {
  min-width: 0;
}

.ao-x .ao-customer strong {
  display: block;
  margin-bottom: 4px;
  color: #0f172a;
  font-size: 13px;
  font-weight: 700;
  overflow-wrap: anywhere;
}

.ao-x .ao-customer span {
  display: block;
  color: #64748b;
  font-size: 11px;
  overflow-wrap: anywhere;
}

.ao-x .ao-total {
  color: #0f172a;
  font-size: 13px;
  font-weight: 800;
  white-space: nowrap;
}

/* ===== Status ===== */
.ao-x .ao-status-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.ao-x .ao-status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 78px;
  padding: 6px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;
}

.ao-x .ao-success {
  background: #dcfce7;
  border: 1px solid #bbf7d0;
  color: #15803d;
}

.ao-x .ao-warning {
  background: #fff7ed;
  border: 1px solid #fed7aa;
  color: #c2410c;
}

.ao-x .ao-status-group small {
  color: #94a3b8;
  font-size: 10px;
}

/* ===== Actions & buttons ===== */
.ao-x .ao-actions {
  display: flex;
  align-items: center;
  gap: 7px;
  flex-wrap: wrap;
}

.ao-x .ao-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  padding: 8px 11px;
  border: 1px solid transparent;
  border-radius: 9px;
  font-family: inherit;
  font-size: 11px;
  font-weight: 800;
  line-height: 1;
  cursor: pointer;
  white-space: nowrap;
  transition:
    transform .18s ease,
    box-shadow .18s ease,
    background .18s ease,
    border-color .18s ease,
    color .18s ease;
}

.ao-x .ao-view {
  background: #eff6ff;
  color: #1d4ed8;
  border-color: #93c5fd;
  box-shadow: 0 2px 5px rgba(37, 99, 235, 0.1);
}

.ao-x .ao-view::before {
  content: "◉";
  margin-right: 6px;
  color: #2563eb;
  font-size: 10px;
}

.ao-x .ao-view:hover {
  background: #2563eb;
  border-color: #2563eb;
  color: #ffffff;
  box-shadow: 0 7px 16px rgba(37, 99, 235, 0.25);
  transform: translateY(-2px);
}

.ao-x .ao-view:hover::before {
  color: #ffffff;
}

.ao-x .ao-paid {
  background: #ecfdf5;
  color: #047857;
  border-color: #86efac;
  box-shadow: 0 2px 5px rgba(16, 185, 129, 0.1);
}

.ao-x .ao-paid::before {
  content: "✓";
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 17px;
  height: 17px;
  margin-right: 5px;
  border-radius: 50%;
  background: #10b981;
  color: #ffffff;
  font-size: 10px;
  font-weight: 900;
}

.ao-x .ao-paid:hover {
  background: #059669;
  border-color: #059669;
  color: #ffffff;
  box-shadow: 0 7px 16px rgba(5, 150, 105, 0.25);
  transform: translateY(-2px);
}

.ao-x .ao-paid:hover::before {
  background: #ffffff;
  color: #059669;
}

.ao-x .ao-delivered {
  background: #f5f3ff;
  color: #6d28d9;
  border-color: #c4b5fd;
  box-shadow: 0 2px 5px rgba(124, 58, 237, 0.1);
}

.ao-x .ao-delivered::before {
  content: "➜";
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 17px;
  height: 17px;
  margin-right: 5px;
  border-radius: 50%;
  background: #8b5cf6;
  color: #ffffff;
  font-size: 10px;
  font-weight: 900;
}

.ao-x .ao-delivered:hover {
  background: #7c3aed;
  border-color: #7c3aed;
  color: #ffffff;
  box-shadow: 0 7px 16px rgba(124, 58, 237, 0.25);
  transform: translateY(-2px);
}

.ao-x .ao-delivered:hover::before {
  background: #ffffff;
  color: #7c3aed;
}

.ao-x .ao-delete {
  background: #fef2f2;
  color: #dc2626;
  border-color: #fca5a5;
  box-shadow: 0 2px 5px rgba(220, 38, 38, 0.1);
}

.ao-x .ao-delete::before {
  content: "×";
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 17px;
  height: 17px;
  margin-right: 5px;
  border-radius: 50%;
  background: #ef4444;
  color: #ffffff;
  font-size: 14px;
  font-weight: 900;
  line-height: 1;
}

.ao-x .ao-delete:hover {
  background: #dc2626;
  border-color: #dc2626;
  color: #ffffff;
  box-shadow: 0 7px 16px rgba(220, 38, 38, 0.28);
  transform: translateY(-2px);
}

.ao-x .ao-delete:hover::before {
  background: #ffffff;
  color: #dc2626;
}

.ao-x .ao-close {
  background: #f1f5f9;
  color: #475569;
  border-color: #cbd5e1;
}

.ao-x .ao-close::before {
  content: "×";
  margin-right: 5px;
  font-size: 15px;
  font-weight: 800;
}

.ao-x .ao-close:hover {
  background: #475569;
  border-color: #475569;
  color: #ffffff;
  box-shadow: 0 7px 16px rgba(71, 85, 105, 0.2);
  transform: translateY(-2px);
}

.ao-x .ao-btn:active {
  transform: translateY(0);
  box-shadow: none;
}

.ao-x .ao-btn:disabled {
  opacity: .45;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* ===== Pagination ===== */
.ao-x .ao-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 4px 18px rgba(15, 23, 42, 0.05);
}

.ao-x .ao-pagination-btn {
  min-width: 95px;
  height: 38px;
  padding: 0 14px;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  background: #eff6ff;
  color: #2563eb;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background .2s ease,
    border-color .2s ease,
    color .2s ease,
    transform .2s ease;
}

.ao-x .ao-pagination-btn:hover:not(:disabled) {
  background: #2563eb;
  border-color: #2563eb;
  color: #ffffff;
  transform: translateY(-1px);
}

.ao-x .ao-pagination-btn:disabled {
  opacity: .45;
  cursor: not-allowed;
}

.ao-x .ao-pagination-info {
  min-width: 120px;
  text-align: center;
  color: #475569;
  font-size: 12px;
  font-weight: 700;
}

/* ===== Modal ===== */
.ao-x .ao-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 25px;
  box-sizing: border-box;
  background: rgba(15, 23, 42, 0.58);
  overflow-y: auto;
}

.ao-x .ao-modal {
  width: 100%;
  max-width: 760px;
  max-height: calc(100vh - 50px);
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0 25px 70px rgba(15, 23, 42, 0.25);
  overflow-y: auto;
}

.ao-x .ao-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.ao-x .ao-modal-header h3 {
  margin: 0 0 5px;
  color: #0f172a;
  font-size: 20px;
}

.ao-x .ao-modal-header span {
  color: #2563eb;
  font-size: 12px;
  font-weight: 700;
  word-break: break-all;
}

.ao-x .ao-modal-x {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 9px;
  background: #f1f5f9;
  color: #475569;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  transition: all .2s ease;
}

.ao-x .ao-modal-x:hover {
  background: #fee2e2;
  color: #dc2626;
}

.ao-x .ao-modal-body {
  padding: 20px;
}

.ao-x .ao-section {
  margin-bottom: 24px;
}

.ao-x .ao-section h4 {
  margin: 0 0 12px;
  color: #0f172a;
  font-size: 15px;
  font-weight: 700;
}

.ao-x .ao-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.ao-x .ao-info-grid > div {
  padding: 13px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
}

.ao-x .ao-info-grid span {
  display: block;
  margin-bottom: 5px;
  color: #64748b;
  font-size: 11px;
  font-weight: 600;
}

.ao-x .ao-info-grid strong {
  display: block;
  color: #0f172a;
  font-size: 13px;
  overflow-wrap: anywhere;
}

.ao-x .ao-items {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.ao-x .ao-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #ffffff;
}

.ao-x .ao-item-image {
  width: 55px;
  height: 55px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 8px;
  background: #f1f5f9;
  color: #94a3b8;
  font-size: 9px;
  text-align: center;
}

.ao-x .ao-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ao-x .ao-item-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ao-x .ao-item-info strong {
  color: #0f172a;
  font-size: 13px;
  overflow-wrap: anywhere;
}

.ao-x .ao-item-info span {
  color: #64748b;
  font-size: 11px;
}

.ao-x .ao-item-total {
  flex-shrink: 0;
  color: #0f172a;
  font-size: 13px;
  font-weight: 800;
  white-space: nowrap;
}

.ao-x .ao-summary {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 18px;
  border-top: 1px solid #e5e7eb;
}

.ao-x .ao-summary > div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.ao-x .ao-summary span {
  color: #64748b;
  font-size: 12px;
}

.ao-x .ao-summary strong {
  color: #0f172a;
  font-size: 13px;
  text-align: right;
}

.ao-x .ao-text-success {
  color: #15803d !important;
}

.ao-x .ao-text-warning {
  color: #c2410c !important;
}

.ao-x .ao-grand {
  margin-top: 8px;
  padding-top: 14px;
  border-top: 1px solid #e5e7eb;
}

.ao-x .ao-grand strong {
  color: #2563eb !important;
  font-size: 17px;
}

.ao-x .ao-modal-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  border-top: 1px solid #e5e7eb;
  background: #f8fafc;
}

/* ===== Tablet ===== */
@media (max-width: 1109px) {
  .ao-x {
    padding: 25px 20px;
  }

  .ao-x .ao-table th,
  .ao-x .ao-table td {
    padding: 12px 8px;
    font-size: 12px;
  }

  .ao-x .ao-actions {
    gap: 5px;
  }

  .ao-x .ao-btn {
    padding: 7px 8px;
    font-size: 10px;
  }
}

/* ===== Small tablet ===== */
@media (max-width: 850px) {
  .ao-x .ao-header {
    align-items: flex-start;
  }

  .ao-x .ao-filters {
    grid-template-columns: 1fr 1fr;
  }

  .ao-x .ao-search-box {
    grid-column: 1 / -1;
  }

  .ao-x .ao-clear-filters {
    width: 100%;
  }

  .ao-x .ao-table th,
  .ao-x .ao-table td {
    padding: 10px 7px;
    font-size: 11px;
  }

  .ao-x .ao-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .ao-x .ao-btn {
    width: 100%;
  }
}

/* ===== Mobile ===== */
@media (max-width: 700px) {
  .ao-x {
    padding: 20px 15px;
  }

  .ao-x .ao-header {
    flex-direction: column;
    align-items: stretch;
    gap: 14px;
  }

  .ao-x .ao-header h2 {
    font-size: 24px;
  }

  .ao-x .ao-count {
    width: fit-content;
  }

  .ao-x .ao-filters {
    grid-template-columns: 1fr;
  }

  .ao-x .ao-search-box {
    grid-column: auto;
  }

  .ao-x .ao-table-wrap {
    width: 100%;
    overflow: visible;
    border: none;
    box-shadow: none;
    background: transparent;
  }

  .ao-x .ao-table {
    display: block;
    width: 100%;
  }

  .ao-x .ao-table thead {
    display: none;
  }

  .ao-x .ao-table tbody {
    display: block;
    width: 100%;
  }

  .ao-x .ao-table tr {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    margin-bottom: 12px;
    padding: 15px;
    box-sizing: border-box;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    background: #ffffff;
    box-shadow: 0 3px 12px rgba(15, 23, 42, 0.05);
  }

  .ao-x .ao-table tr:hover {
    background: #ffffff;
  }

  .ao-x .ao-table td {
    width: 100% !important;
    display: flex;
    align-items: center;
    min-width: 0;
    padding: 8px 5px;
    border: none;
    font-size: 13px;
    box-sizing: border-box;
  }

  .ao-x .ao-table td:nth-child(1) {
    grid-column: 1 / -1;
    padding-bottom: 4px;
  }

  .ao-x .ao-table td:nth-child(2) {
    grid-column: 1 / -1;
    padding-bottom: 10px;
    border-bottom: 1px solid #f1f5f9;
  }

  .ao-x .ao-table td:nth-child(3) {
    grid-column: 1;
  }

  .ao-x .ao-table td:nth-child(4) {
    grid-column: 2;
  }

  .ao-x .ao-table td:nth-child(5) {
    grid-column: 1;
  }

  .ao-x .ao-table td:nth-child(6) {
    grid-column: 2;
  }

  .ao-x .ao-table td:nth-child(7) {
    grid-column: 1 / -1;
    margin-top: 8px;
    padding-top: 13px;
    border-top: 1px solid #f1f5f9;
  }

  .ao-x .ao-actions {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .ao-x .ao-btn {
    width: 100%;
    min-height: 42px;
    padding: 9px 8px;
    border-radius: 9px;
    font-size: 12px;
  }

  .ao-x .ao-pagination {
    gap: 8px;
    padding: 12px;
  }

  .ao-x .ao-pagination-btn {
    min-width: 85px;
    height: 36px;
    padding: 0 10px;
    font-size: 11px;
  }

  .ao-x .ao-pagination-info {
    min-width: 90px;
    font-size: 11px;
  }

  .ao-x .ao-overlay {
    padding: 15px;
    align-items: center;
  }

  .ao-x .ao-modal {
    max-height: calc(100vh - 30px);
    border-radius: 12px;
  }

  .ao-x .ao-modal-header {
    padding: 16px;
  }

  .ao-x .ao-modal-body {
    padding: 16px;
  }

  .ao-x .ao-info-grid {
    grid-template-columns: 1fr;
  }

  .ao-x .ao-modal-footer {
    flex-direction: column;
    align-items: stretch;
    padding: 15px;
  }

  .ao-x .ao-modal-footer .ao-btn {
    width: 100%;
  }
}

/* ===== Very small mobile ===== */
@media (max-width: 400px) {
  .ao-x {
    padding: 15px 10px;
  }

  .ao-x .ao-table tr {
    padding: 12px;
  }

  .ao-x .ao-actions {
    grid-template-columns: 1fr;
  }

  .ao-x .ao-btn {
    min-height: 40px;
  }

  .ao-x .ao-pagination {
    flex-wrap: wrap;
  }

  .ao-x .ao-pagination-btn {
    flex: 1;
    min-width: 0;
  }

  .ao-x .ao-pagination-info {
    width: 100%;
    order: -1;
  }

  .ao-x .ao-overlay {
    padding: 10px;
  }

  .ao-x .ao-modal {
    max-height: calc(100vh - 20px);
  }

  .ao-x .ao-modal-header {
    padding: 14px;
  }

  .ao-x .ao-modal-body {
    padding: 14px;
  }

  .ao-x .ao-modal-footer {
    padding: 14px;
  }
}
`;

function Orders() {
  const {
    fetchOrders,
    fetchOrderById,
    handleMarkOrderAsPaid,
    handleMarkOrderAsDelivered,
    handleDeleteOrder,
  } = useOrders();

  const {
    orders,
    loading,
    error,
    pagination,
  } = useSelector((state) => state.orders);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // =========================
  // PAGINATION
  // =========================

  const [page, setPage] = useState(1);

  const limit = 5;

  // =========================
  // FILTERS
  // =========================

  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [deliveryFilter, setDeliveryFilter] = useState("all");

  // =========================
  // FETCH ORDERS
  // =========================

  useEffect(() => {
    fetchOrders({
      page,
      limit,
    });
  }, [fetchOrders, page]);

  // =========================
  // VIEW ORDER
  // =========================

  const handleViewOrder = async (orderId) => {
    const result = await fetchOrderById(orderId);

    if (result?.data) {
      setSelectedOrder(result.data);
      setShowDetails(true);
    }
  };

  // =========================
  // MARK PAID
  // =========================

  const handlePaid = async (orderId) => {
    try {
      await handleMarkOrderAsPaid(orderId);

      await fetchOrders({
        page,
        limit,
      });

      Swal.fire({
        icon: "success",
        title: "Order Paid",
        text: "Order has been marked as paid successfully.",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          err.response?.data?.message ||
          "Failed to mark order as paid.",
      });
    }
  };

  // =========================
  // MARK DELIVERED
  // =========================

  const handleDelivered = async (orderId) => {
    try {
      await handleMarkOrderAsDelivered(orderId);

      await fetchOrders({
        page,
        limit,
      });

      Swal.fire({
        icon: "success",
        title: "Order Delivered",
        text: "Order has been marked as delivered successfully.",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          err.response?.data?.message ||
          "Failed to mark order as delivered.",
      });
    }
  };

  // =========================
  // DELETE ORDER
  // =========================

  const handleDelete = async (orderId) => {
    const result = await Swal.fire({
      title: "Delete Order?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await handleDeleteOrder(orderId);

      if (selectedOrder?._id === orderId) {
        setSelectedOrder(null);
        setShowDetails(false);
      }

      /*
        لو الصفحة الحالية فيها Order واحد فقط
        والصفحة مش أول صفحة، نرجع للصفحة السابقة.
      */
      if (orders.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      } else if (orders.length > 1) {
        await fetchOrders({
          page,
          limit,
        });
      }

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Order has been deleted successfully.",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          err.response?.data?.message ||
          "Failed to delete order.",
      });
    }
  };

  // =========================
  // CLOSE DETAILS
  // =========================

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedOrder(null);
  };

  // =========================
  // STATUS HELPERS
  // =========================

  const getPaymentStatus = (currentOrder) => {
    return currentOrder?.isPaid ? "Paid" : "Not Paid";
  };

  const getDeliveryStatus = (currentOrder) => {
    return currentOrder?.isDelivered
      ? "Delivered"
      : "Not Delivered";
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString("en-GB");
  };

  // =========================
  // FILTER ORDERS
  // =========================

  const filteredOrders = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return orders.filter((currentOrder) => {
      const orderId =
        currentOrder._id?.toLowerCase() || "";

      const customerName =
        currentOrder.user?.name?.toLowerCase() || "";

      const customerEmail =
        currentOrder.user?.email?.toLowerCase() || "";

      const matchesSearch =
        !normalizedSearch ||
        orderId.includes(normalizedSearch) ||
        customerName.includes(normalizedSearch) ||
        customerEmail.includes(normalizedSearch);

      const matchesPayment =
        paymentFilter === "all" ||
        (paymentFilter === "paid" &&
          currentOrder.isPaid) ||
        (paymentFilter === "not-paid" &&
          !currentOrder.isPaid);

      const matchesDelivery =
        deliveryFilter === "all" ||
        (deliveryFilter === "delivered" &&
          currentOrder.isDelivered) ||
        (deliveryFilter === "not-delivered" &&
          !currentOrder.isDelivered);

      return (
        matchesSearch &&
        matchesPayment &&
        matchesDelivery
      );
    });
  }, [
    orders,
    searchTerm,
    paymentFilter,
    deliveryFilter,
  ]);

  // =========================
  // CLEAR FILTERS
  // =========================

  const clearFilters = () => {
    setSearchTerm("");
    setPaymentFilter("all");
    setDeliveryFilter("all");
  };

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    paymentFilter !== "all" ||
    deliveryFilter !== "all";

  return (
    <div className="ao-x">
      <style>{css}</style>

      {/* =========================
          HEADER
      ========================= */}

      <div className="ao-header">
        <div>
          <h2>Orders</h2>

          <p>
            Manage customer orders, payments and deliveries.
          </p>
        </div>

        <div className="ao-count">
          {filteredOrders.length} / {orders.length} Orders
        </div>
      </div>

      {/* =========================
          FILTERS
      ========================= */}

      {!loading &&
        !error &&
        orders.length > 0 && (
          <div className="ao-filters">
            <div className="ao-search-box">
              <span className="ao-search-icon">
                🔍
              </span>

              <input
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search by order ID, customer or email..."
              />
            </div>

            <div className="ao-filter-select">
              <label htmlFor="payment-filter">
                Payment
              </label>

              <select
                id="payment-filter"
                value={paymentFilter}
                onChange={(event) =>
                  setPaymentFilter(event.target.value)
                }
              >
                <option value="all">
                  All Payments
                </option>

                <option value="paid">
                  Paid
                </option>

                <option value="not-paid">
                  Not Paid
                </option>
              </select>
            </div>

            <div className="ao-filter-select">
              <label htmlFor="delivery-filter">
                Delivery
              </label>

              <select
                id="delivery-filter"
                value={deliveryFilter}
                onChange={(event) =>
                  setDeliveryFilter(event.target.value)
                }
              >
                <option value="all">
                  All Deliveries
                </option>

                <option value="delivered">
                  Delivered
                </option>

                <option value="not-delivered">
                  Not Delivered
                </option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                className="ao-clear-filters"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

      {/* =========================
          LOADING
      ========================= */}

      {loading && (
        <div className="ao-loading">
          Loading orders...
        </div>
      )}

      {/* =========================
          ERROR
      ========================= */}

      {error && !loading && (
        <div className="ao-error">
          {error}
        </div>
      )}

      {/* =========================
          NO ORDERS
      ========================= */}

      {!loading &&
        !error &&
        orders.length === 0 && (
          <div className="ao-empty">
            <h3>No Orders Found</h3>

            <p>
              There are no orders available right now.
            </p>
          </div>
        )}

      {/* =========================
          NO FILTER RESULTS
      ========================= */}

      {!loading &&
        !error &&
        orders.length > 0 &&
        filteredOrders.length === 0 && (
          <div className="ao-empty">
            <h3>No Matching Orders</h3>

            <p>
              Try changing your search or filters.
            </p>

            <button
              type="button"
              className="ao-clear-results"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        )}

      {/* =========================
          ORDERS TABLE
      ========================= */}

      {!loading &&
        !error &&
        filteredOrders.length > 0 && (
          <>
            <div className="ao-table-wrap">
              <table className="ao-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Delivery</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map(
                    (currentOrder) => (
                      <tr key={currentOrder._id}>
                        <td data-label="Order">
                          <span className="ao-id">
                            #
                            {currentOrder._id?.slice(
                              -6
                            )}
                          </span>
                        </td>

                        <td data-label="Customer">
                          <div className="ao-customer">
                            <strong>
                              {currentOrder.user?.name ||
                                "Unknown"}
                            </strong>

                            <span>
                              {currentOrder.user?.email ||
                                "-"}
                            </span>
                          </div>
                        </td>

                        <td data-label="Total">
                          <strong className="ao-total">
                            {currentOrder.totalOrderPrice ??
                              0}{" "}
                            EGP
                          </strong>
                        </td>

                        <td data-label="Payment">
                          <div className="ao-status-group">
                            <span
                              className={`ao-status ${
                                currentOrder.isPaid
                                  ? "ao-success"
                                  : "ao-warning"
                              }`}
                            >
                              {getPaymentStatus(
                                currentOrder
                              )}
                            </span>

                            <small>
                              {currentOrder.paymentMethod ||
                                "cash"}
                            </small>
                          </div>
                        </td>

                        <td data-label="Delivery">
                          <span
                            className={`ao-status ${
                              currentOrder.isDelivered
                                ? "ao-success"
                                : "ao-warning"
                            }`}
                          >
                            {getDeliveryStatus(
                              currentOrder
                            )}
                          </span>
                        </td>

                        <td data-label="Date">
                          {formatDate(
                            currentOrder.createdAt
                          )}
                        </td>

                        <td data-label="Actions">
                          <div className="ao-actions">
                            <button
                              type="button"
                              className="ao-btn ao-view"
                              onClick={() =>
                                handleViewOrder(
                                  currentOrder._id
                                )
                              }
                            >
                              View
                            </button>

                            {!currentOrder.isPaid && (
                              <button
                                type="button"
                                className="ao-btn ao-paid"
                                onClick={() =>
                                  handlePaid(
                                    currentOrder._id
                                  )
                                }
                              >
                                Mark Paid
                              </button>
                            )}

                            {!currentOrder.isDelivered && (
                              <button
                                type="button"
                                className="ao-btn ao-delivered"
                                onClick={() =>
                                  handleDelivered(
                                    currentOrder._id
                                  )
                                }
                              >
                                Deliver
                              </button>
                            )}

                            <button
                              type="button"
                              className="ao-btn ao-delete"
                              onClick={() =>
                                handleDelete(
                                  currentOrder._id
                                )
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* =========================
                PAGINATION
            ========================= */}

            {!loading &&
              !error &&
              pagination &&
              pagination.totalPages > 1 && (
                <div className="ao-pagination">
                  <button
                    type="button"
                    className="ao-pagination-btn"
                    disabled={!pagination.prevPage}
                    onClick={() =>
                      setPage(
                        pagination.prevPage
                      )
                    }
                  >
                    Previous
                  </button>

                  <span className="ao-pagination-info">
                    Page{" "}
                    {pagination.currentPage}{" "}
                    of{" "}
                    {pagination.totalPages}
                  </span>

                  <button
                    type="button"
                    className="ao-pagination-btn"
                    disabled={!pagination.nextPage}
                    onClick={() =>
                      setPage(
                        pagination.nextPage
                      )
                    }
                  >
                    Next
                  </button>
                </div>
              )}
          </>
        )}

      {/* =========================
          ORDER DETAILS MODAL
      ========================= */}

      {showDetails && selectedOrder && (
        <div
          className="ao-overlay"
          onClick={closeDetails}
        >
          <div
            className="ao-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="ao-modal-header">
              <div>
                <h3>Order Details</h3>

                <span>
                  #{selectedOrder._id}
                </span>
              </div>

              <button
                type="button"
                className="ao-modal-x"
                onClick={closeDetails}
              >
                ×
              </button>
            </div>

            <div className="ao-modal-body">
              {/* CUSTOMER */}

              <div className="ao-section">
                <h4>Customer Information</h4>

                <div className="ao-info-grid">
                  <div>
                    <span>Name</span>

                    <strong>
                      {selectedOrder.user?.name ||
                        "-"}
                    </strong>
                  </div>

                  <div>
                    <span>Email</span>

                    <strong>
                      {selectedOrder.user?.email ||
                        "-"}
                    </strong>
                  </div>

                  <div>
                    <span>Phone</span>

                    <strong>
                      {selectedOrder.user?.phone ||
                        "-"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* SHIPPING */}

              <div className="ao-section">
                <h4>Shipping Address</h4>

                <div className="ao-info-grid">
                  <div>
                    <span>Details</span>

                    <strong>
                      {selectedOrder
                        .shippingAddress
                        ?.details || "-"}
                    </strong>
                  </div>

                  <div>
                    <span>City</span>

                    <strong>
                      {selectedOrder
                        .shippingAddress
                        ?.city || "-"}
                    </strong>
                  </div>

                  <div>
                    <span>Postal Code</span>

                    <strong>
                      {selectedOrder
                        .shippingAddress
                        ?.postalCode || "-"}
                    </strong>
                  </div>

                  <div>
                    <span>Phone</span>

                    <strong>
                      {selectedOrder
                        .shippingAddress
                        ?.phone || "-"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* ITEMS */}

              <div className="ao-section">
                <h4>Order Items</h4>

                <div className="ao-items">
                  {selectedOrder.cartItems?.map(
                    (item, index) => (
                      <div
                        className="ao-item"
                        key={`${
                          item.product?._id ||
                          "item"
                        }-${index}`}
                      >
                        <div className="ao-item-image">
                          {item.product
                            ?.imageCover ? (
                            <img
                              src={
                                item.product
                                  .imageCover
                              }
                              alt={
                                item.product?.title ||
                                "Product"
                              }
                            />
                          ) : (
                            <span>
                              No Image
                            </span>
                          )}
                        </div>

                        <div className="ao-item-info">
                          <strong>
                            {item.product?.title ||
                              "Unknown Product"}
                          </strong>

                          <span>
                            Quantity:{" "}
                            {item.quantity || 0}
                          </span>

                          <span>
                            Price:{" "}
                            {item.pricePerUnit ||
                              0}{" "}
                            EGP
                          </span>
                        </div>

                        <strong className="ao-item-total">
                          {item.totalPrice ||
                            (item.pricePerUnit ||
                              0) *
                              (item.quantity ||
                                0)}{" "}
                          EGP
                        </strong>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* SUMMARY */}

              <div className="ao-summary">
                <div>
                  <span>
                    Payment Method
                  </span>

                  <strong>
                    {selectedOrder.paymentMethod ||
                      "cash"}
                  </strong>
                </div>

                <div>
                  <span>
                    Payment Status
                  </span>

                  <strong
                    className={
                      selectedOrder.isPaid
                        ? "ao-text-success"
                        : "ao-text-warning"
                    }
                  >
                    {selectedOrder.isPaid
                      ? "Paid"
                      : "Not Paid"}
                  </strong>
                </div>

                <div>
                  <span>
                    Delivery Status
                  </span>

                  <strong
                    className={
                      selectedOrder.isDelivered
                        ? "ao-text-success"
                        : "ao-text-warning"
                    }
                  >
                    {selectedOrder.isDelivered
                      ? "Delivered"
                      : "Not Delivered"}
                  </strong>
                </div>

                <div className="ao-grand">
                  <span>
                    Total Order Price
                  </span>

                  <strong>
                    {selectedOrder.totalOrderPrice ||
                      0}{" "}
                    EGP
                  </strong>
                </div>
              </div>
            </div>

            {/* MODAL FOOTER */}

            <div className="ao-modal-footer">
              {!selectedOrder.isPaid && (
                <button
                  type="button"
                  className="ao-btn ao-paid"
                  onClick={async () => {
                    await handlePaid(
                      selectedOrder._id
                    );

                    const refreshedOrder =
                      await fetchOrderById(
                        selectedOrder._id
                      );

                    if (refreshedOrder?.data) {
                      setSelectedOrder(
                        refreshedOrder.data
                      );
                    }
                  }}
                >
                  Mark Paid
                </button>
              )}

              {!selectedOrder.isDelivered && (
                <button
                  type="button"
                  className="ao-btn ao-delivered"
                  onClick={async () => {
                    await handleDelivered(
                      selectedOrder._id
                    );

                    const refreshedOrder =
                      await fetchOrderById(
                        selectedOrder._id
                      );

                    if (refreshedOrder?.data) {
                      setSelectedOrder(
                        refreshedOrder.data
                      );
                    }
                  }}
                >
                  Mark Delivered
                </button>
              )}

              <button
                type="button"
                className="ao-btn ao-delete"
                onClick={() =>
                  handleDelete(
                    selectedOrder._id
                  )
                }
              >
                Delete
              </button>

              <button
                type="button"
                className="ao-btn ao-close"
                onClick={closeDetails}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;