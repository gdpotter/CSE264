<?php
/** Greg Potter **/

include 'Action.php';
include 'TaskManagerDAO.php';

class Action_DisplayList implements Action {
    
    public function execute($request) {
        $dao = new TaskManagerDAO;
        $tasks = $dao->getTaskList();
        require("tasklist.php");
    }
    
}

?>