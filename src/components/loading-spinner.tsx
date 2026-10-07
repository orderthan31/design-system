import React from "react";
import "./loading-spinner.css";
export function LoadingSpinner({label='불러오는 중'}:{label?:string}){return <span role="status" aria-label={label} className="ds-loading"><span className="spinner" aria-hidden="true"/>{label}</span>;}
