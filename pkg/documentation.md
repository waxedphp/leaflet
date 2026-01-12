# Leaflet

Special license


### HTML:

```

<div class="waxed-leaflet"
  data-name="payload1"
  data-tiles="https://api.tiles.mapbox.com/v4/[id]/[z]/[x]/[y].png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw"
  data-idt="mapbox.streets"
  data-max-zoom="18"
  style="height: 400px;width: 600px;"
>
  Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>
</div>

```

### PHP:

```

$this->waxed->display([
  'payload' =>

  [
    'popup' => [
        'pos' => [51.2, -0.05],
        'txt' => "I am a lonesome popup.",
    ],
    'markers' => [
      [
        'pos' => [51.5, -0.09],
        'txt' => "Me.",
      ],
      [
        'pos' => [51.5, -0.08],
        'txt' => "Some girls.",
      ],
    ],
    'view' => [
        'x' => 51.2,
        'y' => -0.02,
        'z' => 13,
    ],
  ],

], 'template');

```


