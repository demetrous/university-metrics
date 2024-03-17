//GENERAL, format number with comma-separated thousands
function formatNumberThousands(decimals = 0) {
  return $.fn.dataTable.render.number('\,', '.', decimals, '');
}

//GENERAL, returns date string like "May 24, 2019"
function getShortDate() {
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const d = new Date();

  let dateString = `${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

  return dateString;
}


//GENERAL, show or hide notes div in the end of the page
function showNotes(show) {
  if (show) {
    $("#ReportNotes").attr('style', 'display:block !important');
    $("#officeDateStamp").attr('style', 'display:block !important');
  } else {
    $("#ReportNotes").attr('style', 'display:none !important');
    $("#officeDateStamp").attr('style', 'display:none !important');
  }
}
