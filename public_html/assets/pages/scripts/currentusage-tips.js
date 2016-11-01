jQuery(document).ready(function () {
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "positionClass": "toast-bottom-right",
        "onclick": null,
        "showDuration": "1000",
        "hideDuration": "1000",
        "timeOut": "7000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

    var msgs = ['Hello, some notification sample goes here',
        '<div><input class="form-control input-small" value="textbox"/>&nbsp;<a href="http://themeforest.net/item/metronic-responsive-admin-dashboard-template/4021469?ref=keenthemes" target="_blank">Check this out</a></div><div><button type="button" id="okBtn" class="btn blue">Close me</button><button type="button" id="surpriseBtn" class="btn default" style="margin: 0 8px 0 8px">Surprise me</button></div>',
        'Did you like this one ? :)',
        'Totally Awesome!!!',
        'Yeah, this is the Metronic!',
        'Explore the power of App. Purchase it now!'
    ];
    var i = Math.floor(Math.random() * (msgs.length - 0 + 1) + 0);
    toastr['info'](msgs[i], 'Tip');

    // Wire up an event handler to a button in the toast, if it exists
});
