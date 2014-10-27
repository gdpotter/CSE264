<?php
/** Greg Potter **/

include 'Action.php';
include 'TaskManagerDAO.php';

class Action_Delete implements Action {
    
    public function execute($request) {
        $dao = new TaskManagerDAO;
        foreach ($request->get("delete") as $id) {
            $dao->deleteTask($id);
        }
        header("Location: index.php");
    }

}

?>
