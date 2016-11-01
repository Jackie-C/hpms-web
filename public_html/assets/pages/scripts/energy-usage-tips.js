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

    var msgs = ['You can save up to $115 per year by washing your clothes in cold water',
        'Appliances on standby could consume up to 10% of your energy usage',
        'Using the microwave instead of the electric oven saves energy',
        'Shut doors to areas you are not using to save on your heating costs',
        'Shut your curtains during heat waves to save on your air conditioning costs',
        'Every degree above 20 degrees adds 10% to your heating bill',
        'Roof insulation makes a massive to your energy bills',
        'Cleaning the lint filter on your dryer reduces drying time and saves energy',
        'Power saving globes consume 80% less energy than conventional globes',
        'In you only need a small amount of light, use a lamp or spotlight instead of the main lights'
    ];
    var i = Math.floor(Math.random() * (msgs.length));
    toastr['info'](msgs[i], 'Tip');

    // Wire up an event handler to a button in the toast, if it exists
});
