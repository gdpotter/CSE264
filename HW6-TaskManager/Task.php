<?php
/** Greg Potter **/

class Task {
    public $id;
    public $description;
    public $type;
    public $duedate;
    
    function __construct($id, $description, $type, $duedate) {
        $this->id = $id;
        $this->description = $description;
        $this->type = $type;
        $this->duedate = $duedate;
    }
    
}

?>
