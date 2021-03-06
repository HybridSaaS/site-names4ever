/// <reference path="../../definition/jquery.d.ts" />
/// <reference path="../../../../../Hybrid SaaS/Hybrid SaaS Software (Aspekto)/Hybrid SaaS Software/Website/Core/Website/Script/Product-detail.ts" />
$(function () {
    if (document.getElementsByClassName('handschrift').length || document.getElementsByClassName('zelfontwerpen').length || document.getElementsByClassName('vingerafdruk').length) {
        $('.sheet').html("");
        $('.sheet').insertAfter('.intro.item');
    } else {
        $('.sheet').html("");
        $('.sheet').insertBefore('.details');
    }

    //small to big
    var $smallImages = $('.smallimage');
    var $smallImagesFrames = $('.product-image-rest .imageFrame');

    $smallImages.click(function (event) {
        $smallImagesFrames.removeClass('active');

        var $imagebig = $('#imagebig');
        var $target = $(event.target);
        var url = '/image/product/guid/' + encodeURIComponent($imagebig.data('guid')) + '/' + $target.data('index') + '?height=280&width=400';

        $target.parent().addClass('active');

        $imagebig.attr('src', url).hide().fadeIn(250);
    });

    //retreive related products
    $.getJSON('/data/product/guid/' + encodeURIComponent(WebPage.Data.productGuid) + '/related-products').done(function (data) {
        //has related
        if (data.related) {
            //append to options boxs
            var $related = $('<div class="related-container"></div>');
            $($related).insertAfter('.product-image-rest');

            var handler = function (products, title) {
                if (typeof products != 'undefined') {
                    var $color = $('<div class="related ' + title + '"><div class="imageFrame"><div class="label">' + title + '</div><div class="images"></div></div></div>');

                    $color.on('click', function (event) {
                        event.stopPropagation();

                        if (!$('.related').hasClass('open')) {
                            // Alle dropdowns dicht en deze open
                            $color.toggleClass('open');
                        } else if ($color.hasClass('open')) {
                            // Zelfde dropdown weer dicht
                            $color.removeClass('open');
                        } else {
                            // Andere dropdown dicht en deze open
                            $('.related').removeClass('open');
                            $color.addClass('open');
                        }

                        WebPage.References.$html.one('click', function () {
                            $color.removeClass('open');
                        });
                    });

                    var $container = $color.find('.images');

                    for (var x = 0; x < products.length; x++) {
                        var product = products[x];
                        var $img = $('<img src="/image/product/guid/' + encodeURIComponent(product.guid) + '?width=135&height=94" />');
                        $img.attr({ 'title': product.productcode + '\n' + product.description });
                        $img.data('url', product.url);
                        $container.append($img);
                    }

                    $container.find('img').on('click', function (event) {
                        var $this = $(event.target);
                        if ($this.closest('.related.open').length) {
                            location.href = $this.data('url');
                        }
                    });

                    $related.append($color);
                }
            };

            var matchingString = 'Matching';
            var colorString = 'Color variations';
            var materialString = 'Material variations';
            var alternativeString = 'Alternatives';
            var sizeString = 'Other Sizes';

            var $html = $('html');

            switch ($html.attr('lang')) {
                case 'nl':
                    matchingString = 'Bijpassend';
                    colorString = 'Kleur variaties';
                    materialString = 'Materiaal variaties';
                    alternativeString = 'Alternatieven';
                    sizeString = 'Andere afmetingen';
                    break;

                case 'de':
                    matchingString = 'Passender Schmuck';
                    colorString = 'Farbvarianten';
                    materialString = 'Materialvarianten';
                    alternativeString = 'Alternativen';
                    sizeString = 'verschiedene Größen';
                    break;

                case 'es':
                    matchingString = 'Joyas a juego';
                    colorString = 'Colores disponibles';
                    materialString = 'Variaciones de materiales';
                    alternativeString = 'Alternativas';
                    sizeString = 'Otras dimensiones';
                    break;
            }

            handler(data.related["Supplement"], matchingString);
            handler(data.related["Color"], colorString);
            handler(data.related["Material"], materialString);
            handler(data.related["Alternative"], alternativeString);
            handler(data.related["Size"], sizeString);
        }
    });
});
