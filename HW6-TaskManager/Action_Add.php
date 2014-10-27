<?php
/** Greg Potter **/

include 'Action.php';
include 'TaskManagerDAO.php';

class Action_Add implements Action {
    
    public function execute($request) {
        $dao = new TaskManagerDAO;
        $dao->addTask($request->get("description"),
                $request->get("type"),
                $request->get("datedue"),
                $request->get("more"));
        header("Location: index.php");
    }

}

?>
