<?php
/** Greg Potter **/

include 'Task.php';

class TaskManagerDAO {
    private $_mysqli;
    
    function __construct() {
    }

    function __destruct() {
    }
    
    private function getDBConnection() {
        if (!isset($_mysqli)) {
            $_mysqli = new mysqli("localhost", "root", "", "taskmanager");
            if ($_mysqli->errno) {
                printf("Unable to connect: %s", $_mysqli->error);
                exit();
            }
        }
        return $_mysqli;
    }
    
    public function getTaskList() {
        $lst = array();
        $con = $this->getDBConnection();
        $result = $con->query("SELECT * FROM task");
        $i = 0;
        while ($row = $result->fetch_row()) {
            $rec = new Task($row[0], $row[1], $row[2], $row[3]);
            $lst[$i++] = $rec;
        }
        return $lst;
    }
    
    public function addTask($description, $type, $datedue, $more) {
        $con = $this->getDBConnection();
        $con->query("INSERT INTO task (description, type, duedate) values ('" .
                $description . "', '" . $type . " " . $more . "', '" . 
                $datedue . "')");
    }
    
    public function deleteTask($id) {
        $con = $this->getDBConnection();
        $con->query("DELETE FROM task WHERE id = '" . $id . "'");
    }
}

?>
