import React from 'react';
import { formatSize, formatDateLong as formatDate } from './utils/formatters';
import './CertificatePage.css';


/**
 * CertificatePage — Hoja A4 por documento adjunto.
 * Muestra el archivo real (imagen) o un iframe (PDF).
 * Recibe el color de acento de la plantilla activa.
 */
const CertificatePage = ({ doc, accentColor = '#3b82f6', cvData, userId }) => {
  const isPdf = doc.contentType === 'application/pdf';
  const isImage = doc.contentType?.startsWith('image/');
  const ownerName = cvData?.personalInfo?.name || '';
  const ownerTitle = cvData?.personalInfo?.title || '';
  // Añadir ?userId= para que el backend autorice la petición de vista del archivo
  const authViewUrl = userId ? `${doc.viewUrl}?userId=${userId}` : doc.viewUrl;

  return (
    <div className="cert-page">

      {/* ── Cabecera con color de plantilla ── */}
      <header className="cert-page__header" style={{ borderBottomColor: accentColor }}>
        <div className="cert-page__header-left">
          <span className="cert-page__owner">{ownerName}</span>
          <span className="cert-page__label">Documento de Soporte</span>
        </div>
        <div className="cert-page__badge" style={{ background: accentColor }}>
          <i className={`fa-solid ${isPdf ? 'fa-file-pdf' : 'fa-file-image'}`} />
        </div>
      </header>

      {/* ── Cuerpo ── */}
      <div className="cert-page__body">
        <div className="cert-page__meta">
          <h2 className="cert-page__title" style={{ color: accentColor }}>
            {doc.originalName}
          </h2>
          {doc.description && (
            <p className="cert-page__desc">{doc.description}</p>
          )}
          <div className="cert-page__info-row">
            <span><i className="fa-solid fa-weight-hanging" style={{ marginRight: '4px' }} />{formatSize(doc.fileSize)}</span>
            <span><i className="fa-solid fa-calendar" style={{ marginRight: '4px' }} />{formatDate(doc.uploadedAt)}</span>
            <span style={{ textTransform: 'uppercase', fontWeight: 700 }}>{doc.contentType?.split('/')[1]}</span>
          </div>
        </div>

        {/* ── Visor del archivo ── */}
        <div className="cert-page__viewer">
          {isImage && (
            <img
              className="cert-page__img"
              src={authViewUrl}
              alt={doc.originalName}
              crossOrigin="anonymous"
            />
          )}
          {isPdf && (
            <iframe
              className="cert-page__iframe"
              src={authViewUrl}
              title={doc.originalName}
            />
          )}
          {!isImage && !isPdf && (
            <div className="cert-page__pdf-fallback">
              <i className="fa-solid fa-file" style={{ color: accentColor }} />
              <p>Archivo adjunto: <strong>{doc.originalName}</strong></p>
            </div>
          )}
        </div>
      </div>

      {/* ── Pie de página ── */}
      <footer className="cert-page__footer">
        <span>{ownerName} · {ownerTitle}</span>
        <span className="cert-page__footer-accent" style={{ color: accentColor }}>
          <i className="fa-solid fa-paperclip" />
          Documento verificable
        </span>
      </footer>

    </div>
  );
};

export default CertificatePage;
