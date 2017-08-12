/* global $, jQuery, location, XMLSerializer */
var toggle_html='<span class="toggle">-</span>';
var svg_base = 'filters.svg';

// get url parameters
// from http://stackoverflow.com/questions/11582512/how-to-get-url-parameters-with-javascript/11582513#11582513
function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
}
// allow user to override fontsize
var url = getURLParameter('url');
if (!url) url = 'https://www.wikipedia.org';

jQuery(document).ready(function() {
    
    // set iframe url
    $('#effects').attr( 'src', url );
    
    var filename = 'filters.svg';
    load_svg( filename );
    
    function load_svg( filename ) {
        $.get( filename, function(data) {
            var div = document.createElement("div");
            div.id = 'svg';
            div.innerHTML = new XMLSerializer().serializeToString(data.documentElement);
            document.body.insertBefore(div, document.body.childNodes[0]);
            render_sidebar();
        });
    }
    
    function render_sidebar() {
        
        var content = '<ul>';
        $('#svg defs filter').each(function() {
            var id = $(this).attr('id');
            var name = $(this).attr('inkscape:label');
            var description = $(this).attr('inkscape:menu-tooltip');
            content += '<li data-description="' + description;
            content += '" data-id="' + id + '"';
            content += '">';
            content += name + '</li>';
        });
        content += '</ul>';
        
        $('#filter-list').html( content );
        
        $('#filter-list').on('click', 'li', function () {
            $('#filter-list .selected').removeClass( 'selected' );
            $(this).addClass( 'selected' );
            var id = $(this).data('id');
            var filter_url = 'url("' + svg_base + '#' + id + '")';
            // add selected filter to effect iframe
            $('#effects').css( 'filter', filter_url );
            
            // write CSS code for selected filter
            $('#filter-code').text( 'filter: ' + filter_url + ';' );
            $('#filter-name').text( 'Filter: ' + $(this).text() );
        });

        $('#filter-list ul li:nth-child(4)').trigger( "click" );
        
        // Add keypress to toggle info on '?' or 'h'
        $(document).keypress(function(e) {
            if(e.which == 104 || e.which == 63 || e.which == 72 || e.which == 47) {
                $('#info').toggle();
            }
        });
    }

});