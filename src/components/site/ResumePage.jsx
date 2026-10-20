import { useEffect } from 'react';
import { RESUME_PDF } from '../../data/siteContent';

/** Legacy /resume route — send straight to the PDF. */
export default function ResumePage() {
  useEffect(() => {
    window.location.replace(RESUME_PDF);
  }, []);

  return null;
}
