<?php 

if( ! function_exists('modelGenerator')) {
	/**
	 * Simple Generator for a codeigniter model
	 * 
	 * @param CodeIgniterQueryObject $query
	 * @param callable $callback
	 * @param string $type process row as object or array
	 */
	function modelGenerator($query, $callback, $type="object") {
		while ($row = $query->unbuffered_row($type)) {
			if(is_callable($callback)) {
				$callback($row);
			}
		}
	}
}