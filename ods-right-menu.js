$(document).ready(function () {

    //get right side menu ul
    var rightMenuChildList = $(".child-list-container.right-side .child-list");

    //regex for tags
    var regRemoveTags = /<[^>]+>/g;

    //regex for multi whitespaces
    var regRemoveMultSpaces = /\s+/g;

    //select paragraphs in main container, filter by strong tag only
    //var headers = $(".main-content-fluid .content p")
    var headers = $(".right-menu-header")/*
        .filter(function (index) {

            //true if contains exactly one strong tag
            var isSingleStrong = $("strong", this).length === 1;

            //true if there is nothing besides strong
            var isStrongOnly = $(this).html()
                .replace(/<strong\b[^>]*>(.*?)<\/strong>/g, "")
                .replace(regRemoveMultSpaces, ' ')
                .replace("&nbsp;", '')
                .replace(regRemoveTags, '')
                .length === 0;

            

            //console.log($(this).html().replace(/<strong\b[^>]*>(.*?)<\/strong>/g, "").length);
            return isSingleStrong && isStrongOnly;
        });
        */

    //for each header generate id, assign it to header, generate list onpage links
    $.each(headers, function (i, item) {

        //generate id for the particular Content Header
        var headerId = "content_header_" + i;

        //assign id to Content Header
        $(item).attr("id", headerId);


        //removing tags and mult whitespaces
        var innerHtml = $(item).html().replace(regRemoveTags, '').replace(regRemoveMultSpaces, ' ')


        $(rightMenuChildList).append("<li><a class=\"child-list-item\" href=\"#" + headerId + "\">" + innerHtml + "</a></li>");

    });

});

