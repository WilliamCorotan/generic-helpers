/**
	 * Wrapper for dropdown ajax
	 */
let dropdown = {
    // url properties
    base_url: '',
    url: '', 
    val: '',
    text: '',
    col_name: '',
    col_id: '',

    // element properties
    form: '',
    selector: '',
    data: [],

    /**
     * Initializes dropdown 
     * @param {string} form - Parent form
     * @param {string} selector - Dropdown selector
     */
    init: function(form, selector){
        this.form = form;
        this.selector = selector;

        return this;
    },

    /**
     * Initializes dropdown object variables
     * @param {string} url - Ajax url
     * @param {string} col_name - Column name
     * @param {string} col_id - Column id
     * @param {string} val - Value (default: id)
     * @param {string} text - Display text (default: name)
     */
    set_url: function(url, col_name, col_id, val = 'id', text = 'name'){
        this.base_url = url;
        this.col_name = col_name;
        this.col_id = col_id;
        this.val = val;
        this.text = text;
        this.url = Array.from([this.base_url, this.val, this.text, this.col_name, this.col_id]).join('/');

        return this;
    },

    /**
     * Populates dropdown data
     */
    populate: function()
    {
        if(this.data){
            this.data.forEach((el)=>{
                var option = new Option(el.text, el.id, true, true);
                $(`${this.form} ${this.selector}`).append(option).trigger('change');
            })
        }

        return this;
    },

    /**
     * Makes a get request to the via the object url
     */
    fetch: function(){
        $.ajax({
            type: 'GET', 
            url: this.url,
            async: false,
        }).then(function(res){
            res = JSON.parse(res);
            this.data = res.data
        }.bind(this));

        return this;
    },

}