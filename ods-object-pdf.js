var link = $('a[data-udi^="umb://media"][href$=".pdf"]').filter(function () {
    var isShowPDF = $(this).parent('.on-page-pdf').length > 0 || $(this).parent().parent('.on-page-pdf').length > 0; 
    return isShowPDF;

    //return true;
}).after(function () {
    return '<p class="embed-container mt-3"><object data="' + this.href + '#view=fitH&amp;toolbar=1&amp;statusbar=0&amp;messages=0&amp;navpanes=0" type="application/pdf"></object></p>';



});

link.parent().parent().addClass("mb-5");


