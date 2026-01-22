<?php
namespace Waxedphp\Leaflet;

class Setter extends \Waxedphp\Waxedphp\Php\Setters\AbstractSetter {

  /**
   * @var array<mixed> $setup
   */
  private array $setup = [
  ];
  
  /**
   * allowed options
   *
   * @var array<mixed> $_allowedOptions
   */
  protected array $_allowedOptions = [
  ];
  
  private array $commands = [];
  
  private array $markers = [];

  function setValue($value) {
    $this->setup['value'] = $value;
    return $this;
  }

  function setMode($mode) {
    $this->setup['mode'] = $mode;
    return $this;
  }

  function setTheme($theme) {
    $this->setup['theme'] = $theme;
    return $this;
  }

  function resetMarkers() {
    $this->markers = [];
    return $this;
  }

  function resetCommands() {
    $this->commands = [];
    return $this;
  }

  function addMarker(float $x, float $y, string $text) {
    $cmd = [
      'pos' => [$x,$y],
      'txt' => $text,
    ];
    $this->markers[] = $cmd;
    return $this;
  }

  function setPopup(float $x, float $y, string $text, arra $params = []) {
    $cmd = [
      'pos' => [$x,$y],
      'txt' => $text,
    ];
    $allowed = [
      'pane' => 'String',
      'offset' => 'Point',
      'maxWidth' => 'Number',
      'minWidth' => 'Number',
      'maxHeight' => 'Number',
      'autoPan' => 'Boolean',
      'autoPanPaddingTopLeft' => 'Point',
      'autoPanPaddingBottomRight' => 'Point',
      'autoPanPadding' => 'Point',
      'keepInView' => 'Boolean',
      'closeButton' => 'Boolean',
      'autoClose' => 'Boolean',
      'closeOnEscapeKey' => 'Boolean',
      'closeOnClick' => 'Boolean',
      'className' => 'String',
    ];
    foreach($params as $k=>$v) {
      if ((isset($allowed[$k]))&&($this->is_type($allowed[$k], $v))) {
        $cmd[$k] = $v;
      }
    }
    $this->commands['popup'] = $cmd;
    return $this;
  }
    
  function setView(float $x, float $y, int $z) {
    $cmd = [
      'x' => $x,
      'y' => $y,
      'z' => $z,
    ];
    $this->commands['view'] = $cmd;
    return $this;
  }

  /**
  * value
  *
  * @param mixed $value
  * @return array<mixed>
  */
  public function value(mixed $value = ''): array {
    $a = [];
    if (!empty($this->markers)) {
      $this->commands['markers'] = $this->markers;
      $this->resetMarkers();
    }
    if (!empty($this->commands)) {
      $a = $this->commands;
      $this->resetCommands();
    };
    $b = $this->getArrayOfAllowedOptions();
    if (!empty($b)) {
      $a['config'] = $b;
    }
    $a['value'] = $value;
    return $a;
  }
  
  protected function is_type(string $type, $value) {
    switch(strtolower($type)) {
      case 'boolean': return is_bool($value); break;
      case 'integer': return is_int($value); break;
      case 'float': return is_float($value); break;
      case 'string': return is_string($value); break;
      case 'array': return is_array($value); break;
      case 'object': return is_object($value); break;
      case 'iterable': return is_iterable($value); break;
      case 'resource': return is_resource($value); break;
      case 'null': return is_null($value); break;
      case 'point': return (
          (is_array($value))
          &&(count($value)==2)
          &&(is_float($value[0]))
          &&(is_float($value[2]))
        ); 
      break;
    }
    return false;
  }

}
