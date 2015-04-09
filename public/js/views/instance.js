window.InstanceView = Backbone.View.extend({

    initialize:function () {
        this.render();
    },

    render:function () {
        
        $(this.el).html('<pre>'+JSON.stringify(this.model.toJSON(), null, 4)+'</pre>');
             
        return this;
    }

});