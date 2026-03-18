define([
  'dojo/_base/declare',
  'jimu/BaseWidget',
  'esri/layers/FeatureLayer',
  'esri/tasks/query',
  'esri/tasks/QueryTask'
], function(declare, BaseWidget, FeatureLayer, Query, QueryTask) {

  return declare([BaseWidget], {

    baseClass: 'jimu-widget-resetfields',

    startup: function() {
      this.inherited(arguments);

      document.getElementById("resetBtn").addEventListener("click", () => {
        this.resetFields();
      });
    },

    resetFields: function() {

      const layerUrl = "YOUR_FEATURE_LAYER_URL"; // <-- replace this
      const targetField = "Status";              // field to reset
      const originalField = "Status_Original";   // original field

      const queryTask = new QueryTask(layerUrl);
      const query = new Query();
      query.where = "1=1";
      query.outFields = ["OBJECTID", targetField, originalField];
      query.returnGeometry = false;

      queryTask.execute(query).then((result) => {

        let updates = [];

        result.features.forEach((feature) => {

          let attrs = feature.attributes;

          attrs[targetField] = attrs[originalField];

          updates.push({
            attributes: attrs
          });

        });

        const featureLayer = new FeatureLayer(layerUrl);

        featureLayer.applyEdits(null, updates, null).then(() => {
          document.getElementById("status").innerHTML = "Reset complete!";
        }).catch((err) => {
          console.error(err);
          document.getElementById("status").innerHTML = "Error occurred.";
        });

      });

    }

  });
});