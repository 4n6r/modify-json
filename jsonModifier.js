var self = module.exports = {
    modifyProperty: function(obj, propertyName, value){
        if(obj !== undefined && typeof obj === "object"){
            if(obj[propertyName] !== undefined && typeof obj[propertyName] !== "object"){
                obj[propertyName] = value;
            }
        }
    },

    modifyChildProperty: function(obj, propertyNames, value){
        if(propertyNames.length === 1){
            self.modifyProperty(obj, propertyNames[0], value);
        }else{
            var subItem = propertyNames.shift()
            self.modifyChildProperty(obj[subItem], propertyNames, value)
        }
    },

    modifyPropertyRecursive: function(obj, propertyNames, value){
        self.modifyChildProperty(obj, propertyNames.split("."), value);
    }
}