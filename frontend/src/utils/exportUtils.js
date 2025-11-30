export const exportToCSV = (emails, filename = 'emails') => {
  if (!emails || emails.length === 0) {
    return
  }

  const headers = ['Email ID', 'Subject', 'To', 'Influencer Name', 'Category', 'Priority', 'Status', 'Sent At', 'Body']
  
  const csvContent = [
    headers.join(','),
    ...emails.map(email => {
      const row = [
        email.email_id || '',
        `"${(email.subject || '').replace(/"/g, '""')}"`,
        email.to || '',
        `"${(email.influencer_name || '').replace(/"/g, '""')}"`,
        email.category || '',
        email.priority || '',
        email.delivery_status || '',
        email.sent_at || '',
        `"${(email.body || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
      ]
      return row.join(',')
    })
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const exportToPDF = async (emails, filename = 'emails') => {
  // Simple PDF export using browser print
  const printWindow = window.open('', '_blank')
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Email Export</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #333; }
          .email { margin-bottom: 30px; padding: 15px; border: 1px solid #ddd; }
          .email-header { font-weight: bold; margin-bottom: 10px; }
          .email-body { margin-top: 10px; white-space: pre-wrap; }
        </style>
      </head>
      <body>
        <h1>Email Export - ${new Date().toLocaleDateString()}</h1>
        ${emails.map(email => `
          <div class="email">
            <div class="email-header">
              <strong>${email.email_id}</strong> | ${email.subject} | ${email.to}
            </div>
            <div>Category: ${email.category} | Priority: ${email.priority} | Status: ${email.delivery_status}</div>
            <div>Sent: ${new Date(email.sent_at).toLocaleString()}</div>
            <div class="email-body">${email.body || ''}</div>
          </div>
        `).join('')}
      </body>
    </html>
  `
  
  printWindow.document.write(htmlContent)
  printWindow.document.close()
  printWindow.print()
}

