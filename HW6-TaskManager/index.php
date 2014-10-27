<?php
/** Greg Potter **/

include 'Request.php';

$request = new Request();
$class = 'Action_' . $request->getCommand();
require_once $class . '.php';
$action = new $class;
$action->execute($request);

?>
