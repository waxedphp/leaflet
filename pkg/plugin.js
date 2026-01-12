
;(function ( $, window, document, undefined ) {

    var pluginName = 'leaflet',
        _search = '.waxed-leaflet',
        _api = [],
        defaults = {
            propertyName: "value"
        },
        inited = false
        ;

    function Instance(pluggable,element,dd){
      var that = this;
      this.pluggable = pluggable;
      this.element = element;
      this.o = element;
      this.t = 'leaflet';
      this.dd = dd;
      this.name = '';
      this.icons = {
      };
      this.points = [];
      this.pointGroups = {};
      this.layerGroups = {};
      this.cfg = {
      };

      this.invalidate = function(RECORD){

      },

      this.setRecord = function(RECORD){
        if (typeof that.dd.name == 'undefined') return;
        var rec = that.pluggable.getvar(that.dd.name, RECORD);
        if (typeof rec != 'object') { return; };

        if ((typeof rec.clearMarkers == 'boolean')&&(rec.clearMarkers)) {
          that.map.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
               layer.remove();
            }
          });
          this.points = [];
        } else if ((typeof rec.clearMarkers == 'string')
          &&(typeof that.layerGroups[rec.clearMarkers] == 'object')) {
          if (typeof this.layerGroups[rec.clearMarkers] != 'undefined') {
            this.layerGroups[rec.clearMarkers].eachLayer((layer) => {
              if (layer instanceof L.Marker) {
                layer.remove();
              }
            });
            //delete(that.layerGroups[rec.clearMarkers]);
          };
          if (typeof this.pointGroups[rec.clearMarkers] != 'undefined') {
            this.pointGroups[rec.clearMarkers] = [];
          }
        }

        if (typeof rec.icons == 'object') {
          for (var x in rec.icons) {
            that._addIcon(x, rec.icons[x]);
          };
        };

        if (typeof rec.markers == 'object') {
          for (var i = 0; i < rec.markers.length; i++ ) {
            that._marker(rec.markers[i]);
          };
        };

        if (typeof rec.markerPopup == 'object') {
            this.layerGroups[rec.markerPopup.group].eachLayer((layer) => {
              if (layer instanceof L.Marker) {
                if(layer.options.point_id == rec.markerPopup.point) {
                  console.log('yes',layer.options.point_id,layer.options.popup);

                }

              }
            });
        };

        if (typeof rec.popup == 'object') {
          that._popup(rec.popup);
        };

        if (typeof rec.view == 'object') {
          that._view(rec.view);
        };


        if ((typeof rec.focus == 'boolean')&&(rec.focus)&&(that.points.length > 1)) {

          that.map.fitBounds(that.points);
          setTimeout(function(){
            that.map.fitBounds(that.points);
          },1000);
        } else if ((typeof rec.focus == 'string')
        &&(typeof that.pointGroups[rec.focus] == 'object')
        &&(that.pointGroups[rec.focus].length > 1)
        ) {
          let points = that.pointGroups[rec.focus];
          that.map.fitBounds(points);
          setTimeout(function(){
            that.map.fitBounds(points);
          },1000);
        };

      },

      this._addIcon = function(name, o) {
        if (typeof name != 'string') return;
        if (typeof o == 'string') o = {iconUrl: o};
        if (typeof o != 'object') return;
        this.icons[name] = L.icon(o);

        /*
        iconUrl: '/img/icons/point.png'
        iconSize: [38, 95],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76],
        shadowUrl: 'my-icon-shadow.png',
        shadowSize: [68, 95],
        shadowAnchor: [22, 94]
        */
      },

      this.free = function() {

      },

      this._tileLayer = function() {

        if (typeof that.dd.tiles == 'string') {

          var url = decodeURIComponent(that.dd.tiles).replace(/\[/g, '{').replace(/\]/g, '}');
          //console.log(url);

        }  else {

          var url = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}';

        };

        var cfg = {
          attribution: that.dd.attribution
          //maxZoom: 18,
          //id: 'mapbox.streets',
          //accessToken: 'your.mapbox.access.token'
        };

        if (typeof that.dd.maxZoom == 'number') {
          cfg.maxZoom = that.dd.maxZoom;
        };

        if (typeof that.dd.accessToken == 'string') {
          cfg.accessToken = that.dd.accessToken;
        };

        if (typeof that.dd.idt == 'string') {
          cfg.id = that.dd.idt;
        };


        new L.TileLayer(url, cfg).addTo(that.map);

      },

      this._marker = function(o) {
        if (typeof o.pos != 'object') {
          return;
        };
        this.points.push(o.pos);
        if (typeof o.group == 'string') {
          if (typeof this.pointGroups[o.group] == 'undefined') {
            this.pointGroups[o.group] = [];
          };
          this.pointGroups[o.group].push(o.pos);
        };

        //{icon: that.icons[o.icon]}
        var setup = {
          };
        if ((typeof o.icon == 'string')&&(typeof this.icons[o.icon] != 'undefined')) {
          setup.icon = this.icons[o.icon];
        };
        if (typeof o.zIndex == 'number') {
          setup.zIndexOffset = o.zIndex;
        };
        if ((typeof o.point_id == 'string')||(typeof o.point_id == 'number')) {
          setup.point_id = o.point_id;
        };

        //var m = L.marker(o.pos, setup);
        var m = new that.CustomMarker(o.pos, setup);
        if (typeof o.group == 'string') {
          if (typeof this.layerGroups[o.group] == 'undefined') {
            this.layerGroups[o.group] = L.layerGroup([]);
          };
          this.layerGroups[o.group].addLayer(m);
        };
        m.addTo(that.map);
        if (typeof o.txt == 'string') {
          m.options.popup = m.bindPopup(o.txt).addTo(that.map);;
          //p.openPopup();
        };
        m.on('click', function(e){
          //console.log('click', e.latlng, o.point_id, arguments);
          that.pluggable.sendData({
            position:e.latlng.lat+':'+e.latlng.lng,
            point:o.point_id,
            action:that.dd.name+'/marker/click'
          }, that.dd.url, that);
        });
        m.on('dblclick', function(e){
          //console.log('dblclick', e.latlng, o.point_id, arguments);
          that.pluggable.sendData({
            position:e.latlng.lat+':'+e.latlng.lng,
            point:o.point_id,
            action:that.dd.name+'/marker'
          }, that.dd.url, that);
        });



        return m;

      },

      this._popup = function(p) {

        var popup = new L.Popup();
        if (typeof p.pos == 'object') {
          popup.setLatLng(p.pos);//[51.5, -0.09]
        };
        if (typeof p.txt == 'string') {
          popup.setContent(p.txt);
        };
        popup.openOn(that.map);
        return popup;

      },

      this._view = function(o) {
        if ((typeof o.x == 'number') && (typeof o.y == 'number') && (typeof o.z == 'number')) {
          that.map.setView([o.x, o.y], o.z);
          return;
          
        };

        if ((typeof o.x == 'number') && (typeof o.y == 'number')) {
          var latlng = new L.LatLng(o.x, o.y);
          that.map.panTo(latlng);//[51.5, -0.09]
          //console.log(o.x,o.y);
        };
        if (typeof o.z == 'number') {
          setTimeout(function(){
            that.map.setZoom(o.z);
          }, 500);
        };

      },

      this._addButton = function() {
        L.Control.Button = L.Control.extend({
            onAdd: function(map) {
                var img = L.DomUtil.create('img');
                img.src = '/img/icons/ball.png';
                img.style.width = '30px';
                img.style.cursor = 'pointer';
                $(img).on('mouseover', function(e){
                  //console.log('MOVER', e);
                });

                $(img).on('click', function(){
                  //console.log('CLICK', that.map.getBounds());
                });
                return img;
            },

            onRemove: function(map) {
                // Nothing to do here
            }
        });

        L.control.Button = function(opts) {
            return new L.Control.Button(opts);
        }

        L.control.Button({ position: 'bottomleft' }).addTo(that.map);
      },

      this._onchange = function(ev) {

        var o = {};
        var ll = that.map.getCenter();
        o.x = ll.lng;
        o.y = ll.lat;
        o.z = that.map.getZoom();
        var s = '['+o.x+':'+o.y+':'+o.z+']';
        //console.log('KVIK',s, that.map.getBounds());

      },


      this._ondblclick = function(ev) {

        console.log('DBL',ev.latlng, that.map.getBounds());
          that.pluggable.sendData({
            lat:ev.latlng.lat,
            lon:ev.latlng.lng,
            zoom: that.map.getZoom(),
            action:that.dd.name+'/dblclick'
          }, that.dd.url, that);
      },

      this.init=function() {

        that.CustomMarker = L.Marker.extend({
           options: {
              point_id: '',
              popup: null
           }
        });

        that.dd.attribution = $(that.element).html();
        $(that.element).html('');

        if (typeof that.dd.icon == 'string') this._addIcon('default', that.dd.icon);

        that.map = new L.Map(that.element).setView([51.505, -0.09], 13);
        //that._addButton();

        //var marker = L.marker([51.5, -0.09]).addTo(that.map);
        //marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();

        //this._popup();

        this._tileLayer();

        that.map.on('moveend', that._onchange);
        that.map.on('zoomend', that._onchange);
        that.map.on('dblclick', that._ondblclick);

        inited = true;
      },
      this._init_();
    }

    $.waxxx(pluginName, _search, Instance, _api);


})( jQuery, window, document );
/*--*/
//# sourceURL: /js/jam/boilerplate/plugin.js
